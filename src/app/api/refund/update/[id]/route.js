
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Razorpay from "razorpay";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

import Refund from "@/lib/model/refund";
import Order from "@/lib/model/order";
import Return from "@/lib/model/return";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const sendError = (message, status = 400) =>
    NextResponse.json(
        {
            success: false,
            message,
        },
        { status }
    );

const populateRefund = (query) =>
    query
        .populate("orderId")
        .populate("returnId")
        .populate("userId");

export async function PUT(request, { params }) {
    let lockedRefundId = null;

    try {
        await dbConnect();

        // 1. Authenticate admin
        const user = await verifyToken(request);

        if (!user) {
            return sendError("Please login first.", 401);
        }

        const isAdmin =
            String(user.role || "").toLowerCase() === "admin" ||
            user.isAdmin === true;

        if (!isAdmin) {
            return sendError("Admin access required.", 403);
        }

        // 2. Validate refund ID
        const { id } = await params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return sendError("Invalid refund ID.");
        }

        // 3. Read request body
        let body;

        try {
            body = await request.json();
        } catch {
            return sendError("Invalid JSON request body.");
        }

        const {
            action,
            adminNotes,
            failureReason,
            manualPayoutConfirmed,
            payoutReference,
        } = body;

        const allowedActions = [
            undefined,
            "process",
            "check_status",
            "confirm_manual_payout",
        ];

        if (!allowedActions.includes(action)) {
            return sendError("Invalid refund action.");
        }

        if (
            adminNotes !== undefined &&
            typeof adminNotes !== "string"
        ) {
            return sendError("Admin notes must be text.");
        }

        if (
            failureReason !== undefined &&
            typeof failureReason !== "string"
        ) {
            return sendError("Failure reason must be text.");
        }

        // 4. Find refund
        const refund = await Refund.findById(id);

        if (!refund) {
            return sendError("Refund record not found.", 404);
        }

        // ================================================
        // NOTES-ONLY UPDATE
        // ================================================
        // Client cannot directly set refund status.
        if (!action) {
            const updateData = {};

            if (adminNotes !== undefined) {
                updateData.adminNotes = adminNotes.trim();
            }

            if (failureReason !== undefined) {
                updateData.failureReason = failureReason.trim();
            }

            if (Object.keys(updateData).length === 0) {
                return sendError("No update data provided.");
            }

            const updatedRefund = await populateRefund(
                Refund.findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            ).lean();

            if (!updatedRefund) {
                return sendError("Refund record not found.", 404);
            }

            return NextResponse.json({
                success: true,
                message: "Refund notes updated successfully.",
                refund: updatedRefund,
            });
        }

        // ================================================
        // CHECK EXISTING RAZORPAY REFUND STATUS
        // Does not create a new refund.
        // ================================================
        if (action === "check_status") {
            if (refund.paymentMethod !== "razorpay") {
                return sendError(
                    "Status checking is only available for Razorpay refunds."
                );
            }

            if (!refund.razorpayRefundId) {
                return sendError(
                    "Razorpay refund ID is missing. Verify the refund in Razorpay Dashboard before retrying."
                );
            }

            let razorpayRefund;

            try {
                razorpayRefund = await razorpay.refunds.fetch(
                    refund.razorpayRefundId
                );
            } catch (providerError) {
                console.error(
                    "RAZORPAY REFUND STATUS CHECK ERROR:",
                    providerError
                );

                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Unable to verify the existing Razorpay refund. Check Razorpay Dashboard and try again.",
                    },
                    { status: 502 }
                );
            }

            const providerStatus = razorpayRefund.status;

            let nextStatus;

            if (providerStatus === "processed") {
                nextStatus = "processed";
            } else if (providerStatus === "failed") {
                nextStatus = "failed";
            } else {
                nextStatus = "processing";
            }

            const refundUpdate = {
                status: nextStatus,
                razorpayRefundId: razorpayRefund.id,
                failureReason:
                    nextStatus === "failed"
                        ? "Razorpay reports that this refund failed."
                        : "",
            };

            if (nextStatus === "processed") {
                refundUpdate.processedAt =
                    refund.processedAt || new Date();
            }

            if (nextStatus === "failed") {
                refundUpdate.failedAt =
                    refund.failedAt || new Date();
            }

            const updatedRefund = await populateRefund(
                Refund.findByIdAndUpdate(
                    refund._id,
                    { $set: refundUpdate },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            ).lean();

            return NextResponse.json({
                success: true,
                message:
                    nextStatus === "processed"
                        ? "Razorpay reports that the refund has been processed."
                        : nextStatus === "failed"
                            ? "Razorpay reports that the refund failed."
                            : "Refund is still processing. Check again later.",
                refund: updatedRefund,
                razorpayRefund: {
                    id: razorpayRefund.id,
                    status: providerStatus,
                    amount: razorpayRefund.amount,
                    currency: razorpayRefund.currency,
                },
            });
        }

        // All remaining actions require a pending refund.
        if (refund.status !== "pending") {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        `Refund is currently ${ refund.status }.` +
                        "It cannot be initiated again.",
                },
                { status: 409 }
            );
        }


        // ================================================
        // ASSOCIATED RETURN / ORDER VALIDATION
        // ================================================

        const isCancellationRefund =
            refund.refundType === "cancellation" &&
            !refund.returnId;

        let returnRequest = null;

        if (!isCancellationRefund) {
            if (!refund.returnId) {
                return sendError(
                    "Return ID is missing for this return refund."
                );
            }

            returnRequest = await Return.findById(
                refund.returnId
            );

            if (!returnRequest) {
                return sendError(
                    "Associated return request not found.",
                    404
                );
            }

            if (returnRequest.status !== "completed") {
                return sendError(
                    "Refund can only be processed after the return is completed."
                );
            }
        }

        const order = await Order.findById(refund.orderId);

        if (!order) {
            return sendError(
                "Associated order not found.",
                404
            );
        }

        // Cancellation refunds require a cancelled order.
        if (
            isCancellationRefund &&
            order.orderStatus !== "cancelled"
        ) {
            return sendError(
                "Cancellation refund requires a cancelled order."
            );
        }

        const amountInRupees = Number(refund.amount);

        if (
            !Number.isFinite(amountInRupees) ||
            amountInRupees <= 0
        ) {
            return sendError("Invalid refund amount.");
        }


        // ================================================
        // COD: MANUAL PAYOUT CONFIRMATION
        // ================================================

        if (action === "confirm_manual_payout") {
            const refundPaymentMethod = String(
                refund.paymentMethod || ""
            ).trim().toLowerCase();

            const orderPaymentMethod = String(
                order?.paymentMethod || ""
            ).trim().toLowerCase();

            console.log("COD PAYOUT API HIT", {
                refundId: String(refund._id),
                refundPaymentMethod,
                orderPaymentMethod,
                status: refund.status,
            });

            if (
                orderPaymentMethod !== "cod" ||
                (
                    refundPaymentMethod &&
                    refundPaymentMethod !== "cod"
                )
            ) {
                return sendError(
                    "This action is only for COD refunds."
                );
            }

            if (manualPayoutConfirmed !== true) {
                return sendError(
                    "Confirm that the customer has actually received the payout."
                );
            }

            if (
                typeof payoutReference !== "string" ||
                !payoutReference.trim()
            ) {
                return sendError(
                    "Enter the bank transfer UTR or payout reference."
                );
            }

            const reference = payoutReference.trim();

            if (
                process.env.NODE_ENV === "production" &&
                /^TEST[-_]/i.test(reference)
            ) {
                return sendError(
                    "Test payout references are not allowed in production."
                );
            }

            const updateData = {
                paymentMethod: "cod",
                payoutReference: reference,
                status: "processed",
                initiatedAt: refund.initiatedAt || new Date(),
                processedAt: new Date(),
                failureReason: "",
            };

            if (adminNotes !== undefined) {
                updateData.adminNotes = adminNotes.trim();
            }

            const updatedRefund = await populateRefund(
                Refund.findOneAndUpdate(
                    {
                        _id: refund._id,
                        status: "pending",
                    },
                    {
                        $set: updateData,
                    },
                    {
                        new: true,
                        runValidators: true,
                    }
                )
            ).lean();

            if (!updatedRefund) {
                return sendError(
                    "Refund has already been updated or is being processed.",
                    409
                );
            }

            return NextResponse.json({
                success: true,
                message: "COD refund updated successfully.",
                refund: updatedRefund,
            });
        }
        
        // ================================================
        // RAZORPAY: ACTUAL REFUND
        // ================================================
        if (action !== "process") {
            return sendError("Invalid refund action.");
        }

        if (
            refund.paymentMethod !== "razorpay" ||
            String(order.paymentMethod || "").toLowerCase() !== "razorpay"
        ) {
            return sendError(
                "For COD orders, use the manual payout confirmation flow."
            );
        }

        if (String(order.paymentStatus || "").toLowerCase() !== "paid") {
            return sendError(
                "Order does not have a confirmed paid status."
            );
        }

        const paymentId =
            order.razorpayPaymentId ||
            refund.razorpayPaymentId ||
            refund.paymentId;

        if (
            typeof paymentId !== "string" ||
            !paymentId.startsWith("pay_")
        ) {
            return sendError(
                "A valid Razorpay payment ID was not found."
            );
        }

        // Verify original payment with Razorpay.
        let payment;

        try {
            payment = await razorpay.payments.fetch(paymentId);
        } catch (providerError) {
            console.error(
                "RAZORPAY PAYMENT FETCH ERROR:",
                providerError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Unable to verify the original Razorpay payment.",
                },
                { status: 502 }
            );
        }

        if (
            payment.status !== "captured" ||
            payment.captured !== true
        ) {
            return sendError(
                "The Razorpay payment has not been captured."
            );
        }

        const amountInPaise = Math.round(
            amountInRupees * 100
        );

        if (amountInPaise > Number(payment.amount || 0)) {
            return sendError(
                "Refund amount exceeds the original payment amount."
            );
        }

        // Atomically claim the pending refund.
        const lockedRefund = await Refund.findOneAndUpdate(
            {
                _id: refund._id,
                status: "pending",
                paymentMethod: "razorpay",
            },
            {
                $set: {
                    status: "processing",
                    initiatedAt: new Date(),
                    adminNotes:
                        adminNotes !== undefined
                            ? adminNotes.trim()
                            : refund.adminNotes || "",
                    failureReason: "",
                    paymentId,
                    razorpayPaymentId: paymentId,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!lockedRefund) {
            return sendError(
                "Refund has already been updated or is being processed.",
                409
            );
        }

        lockedRefundId = lockedRefund._id;

        let razorpayRefund;

        try {
            razorpayRefund = await razorpay.payments.refund(
                paymentId,
                {
                    amount: amountInPaise,
                    notes: {
                        refundId: String(refund._id),
                        returnId: String(refund.returnId),
                        orderId: String(refund.orderId),
                    },
                }
            );
        } catch (providerError) {
            // The request might have succeeded at Razorpay even
            // if our server received a timeout. Do not retry blindly.
            await Refund.findByIdAndUpdate(
                lockedRefundId,
                {
                    $set: {
                        status: "processing",
                        failureReason:
                            "Refund outcome is unconfirmed. Reconcile with Razorpay before retrying.",
                    },
                }
            );

            console.error(
                "RAZORPAY REFUND OUTCOME UNCERTAIN:",
                providerError
            );

            lockedRefundId = null;

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Razorpay refund outcome is unconfirmed. Check Razorpay Dashboard before retrying.",
                },
                { status: 502 }
            );
        }

        const providerStatus =
            razorpayRefund.status === "processed"
                ? "processed"
                : razorpayRefund.status === "failed"
                    ? "failed"
                    : "processing";

        const refundUpdate = {
            status: providerStatus,
            razorpayRefundId: razorpayRefund.id,
            failureReason:
                providerStatus === "failed"
                    ? "Razorpay reported that the refund failed."
                    : "",
        };

        if (providerStatus === "processed") {
            refundUpdate.processedAt = new Date();
        }

        if (providerStatus === "failed") {
            refundUpdate.failedAt = new Date();
        }

        const updatedRefund = await populateRefund(
            Refund.findByIdAndUpdate(
                lockedRefundId,
                { $set: refundUpdate },
                {
                    new: true,
                    runValidators: true,
                }
            )
        ).lean();

        lockedRefundId = null;

        return NextResponse.json({
            success: true,
            message:
                providerStatus === "processed"
                    ? "Razorpay refund processed successfully."
                    : providerStatus === "failed"
                        ? "Razorpay reported a failed refund."
                        : "Refund initiated and is being processed.",
            refund: updatedRefund,
            razorpayRefund: {
                id: razorpayRefund.id,
                status: razorpayRefund.status,
                amount: razorpayRefund.amount,
                currency: razorpayRefund.currency,
            },
        });
    } catch (error) {
        console.error("UPDATE / PROCESS REFUND ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error?.message ||
                    "Unable to update or process refund.",
            },
            { status: 500 }
        );
    }
}