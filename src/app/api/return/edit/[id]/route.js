
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import Return from "@/lib/model/return";
import Order from "@/lib/model/order";
import Refund from "@/lib/model/refund";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

const VALID_STATUSES = [
    "pending",
    "approved",
    "rejected",
    "received",
    "completed",
    "cancelled",
];

const VALID_RETURN_TYPES = ["full", "partial"];

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        // 1. Authenticate admin
        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                },
                { status: 401 }
            );
        }

        const isAdmin =
            user.role === "admin" ||
            user.role === "Admin" ||
            user.isAdmin === true;

        if (!isAdmin) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied. Admin only.",
                },
                { status: 403 }
            );
        }

        // 2. Validate return ID
        const { id } = await params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return request ID.",
                },
                { status: 400 }
            );
        }

        // 3. Read request body
        const body = await request.json();

        const {
            status,
            adminNotes,
            totalRefundAmount,
            returnType,
        } = body;

        // 4. Find return request
        const returnRequest = await Return.findById(id);

        if (!returnRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Return request not found.",
                },
                { status: 404 }
            );
        }

        // 5. Validate status
        if (
            status !== undefined &&
            !VALID_STATUSES.includes(status)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return request status.",
                    validStatuses: VALID_STATUSES,
                },
                { status: 400 }
            );
        }

        // 6. Validate return type
        if (
            returnType !== undefined &&
            !VALID_RETURN_TYPES.includes(returnType)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return type.",
                    validReturnTypes: VALID_RETURN_TYPES,
                },
                { status: 400 }
            );
        }

        // 7. Validate refund amount
        if (totalRefundAmount !== undefined) {
            if (
                typeof totalRefundAmount !== "number" ||
                !Number.isFinite(totalRefundAmount) ||
                totalRefundAmount < 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message:
                            "Refund amount must be a valid non-negative number.",
                    },
                    { status: 400 }
                );
            }
        }

        // 8. Validate admin notes
        if (
            adminNotes !== undefined &&
            typeof adminNotes !== "string"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Admin notes must be a string.",
                },
                { status: 400 }
            );
        }

        // 9. Apply changes in memory
        if (adminNotes !== undefined) {
            returnRequest.adminNotes = adminNotes.trim();
        }

        if (totalRefundAmount !== undefined) {
            returnRequest.totalRefundAmount = totalRefundAmount;
        }

        if (returnType !== undefined) {
            returnRequest.returnType = returnType;
        }

        if (status !== undefined) {
            returnRequest.status = status;

            if (status === "approved" && !returnRequest.approvedAt) {
                returnRequest.approvedAt = new Date();
            }

            if (status === "received" && !returnRequest.receivedAt) {
                returnRequest.receivedAt = new Date();
            }

            if (status === "completed" && !returnRequest.completedAt) {
                returnRequest.completedAt = new Date();
            }
        }

        // 10. Refund handling:
        // Refund is created ONLY when the Return status is completed.
        // If already completed, a missing refund can still be created.
        let refund = null;
        let paymentData = null;

        if (returnRequest.status === "completed") {
            // Reuse an existing refund; never create a duplicate.
            refund = await Refund.findOne({
                returnId: returnRequest._id,
            });

            // Prepare payment details only if no refund exists yet.
            if (!refund) {
                const amount = returnRequest.totalRefundAmount;

                if (
                    typeof amount !== "number" ||
                    !Number.isFinite(amount) ||
                    amount <= 0
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "A refund amount greater than zero is required before completing this return.",
                        },
                        { status: 400 }
                    );
                }

                const order = await Order.findById(
                    returnRequest.orderId
                );
                console.log("RETURN ID:", returnRequest?._id);
                console.log("ORDER ID:", order?._id);
                console.log("PAYMENT METHOD:", order?.paymentMethod);
                console.log("PAYMENT STATUS:", order?.paymentStatus);
                console.log("RAZORPAY PAYMENT ID:", order?.razorpayPaymentId);
                console.log("COD PAYMENT ID:", order?.codPaymentId);

                if (!order) {
                    return NextResponse.json(
                        {
                            success: false,
                            message: "Related order not found.",
                        },
                        { status: 404 }
                    );
                }

                if (
                    typeof order.totalAmount !== "number" ||
                    amount > order.totalAmount
                ) {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "Refund amount cannot exceed the order total.",
                        },
                        { status: 400 }
                    );
                }

                // Razorpay payment validation
                if (order.paymentMethod === "razorpay") {
                    if (
                        order.paymentStatus !== "paid" ||
                        !order.razorpayPaymentId
                    ) {
                        return NextResponse.json(
                            {
                                success: false,
                                message:
                                    "A confirmed Razorpay payment ID is required.",
                            },
                            { status: 400 }
                        );
                    }

                    paymentData = {
                        paymentMethod: "razorpay",
                        paymentId: order.razorpayPaymentId,
                        razorpayPaymentId: order.razorpayPaymentId,
                        codPaymentId: "",
                    };
                }
                // COD payment validation
                else if (order.paymentMethod === "cod") {
                    if (
                        order.paymentStatus !== "paid" ||
                        !order.codPaymentId
                    ) {
                        return NextResponse.json(
                            {
                                success: false,
                                message:
                                    "A paid COD order with a COD payment reference is required.",
                            },
                            { status: 400 }
                        );
                    }

                    paymentData = {
                        paymentMethod: "cod",
                        paymentId: order.codPaymentId,
                        razorpayPaymentId: "",
                        codPaymentId: order.codPaymentId,
                    };
                } else {
                    return NextResponse.json(
                        {
                            success: false,
                            message:
                                "Unsupported payment method for refunds.",
                        },
                        { status: 400 }
                    );
                }
            }
        }

        // 11. Save the Return first.
        // At this point, all validations for a new refund have passed.
        await returnRequest.save();

        // 12. Create a Refund only for a completed Return.
        if (returnRequest.status === "completed" && !refund) {
            try {
                refund = await Refund.create({
                    orderId: returnRequest.orderId,
                    returnId: returnRequest._id,
                    userId: returnRequest.userId,

                    ...paymentData,

                    amount: returnRequest.totalRefundAmount,
                    currency: "INR",
                    refundType: returnRequest.returnType,
                    status: "pending",
                    reason: returnRequest.reason || "",
                    adminNotes: returnRequest.adminNotes || "",
                });
            } catch (createError) {
                // Handle a concurrent request creating the same refund.
                if (createError.code === 11000) {
                    refund = await Refund.findOne({
                        returnId: returnRequest._id,
                    });

                    if (!refund) {
                        throw createError;
                    }
                } else {
                    throw createError;
                }
            }
        }

        // 13. Fetch updated Return details
        const updatedReturnRequest = await Return.findById(id)
            .populate("orderId")
            .populate(
                "userId",
                "profileName fullName email mobileNumber profileImage"
            )
            .populate("items.productId");

        // 14. Send response
        let message = "Return request updated successfully.";

        if (returnRequest.status === "completed") {
            message = refund
                ? "Return completed. Refund record is pending processing."
                : "Return completed, but no refund record was created.";
        } else if (returnRequest.status === "approved") {
            message =
                "Return approved. Refund will be created after completion.";
        } else if (returnRequest.status === "received") {
            message =
                "Return received. Complete the inspection before completing the return.";
        }

        return NextResponse.json(
            {
                success: true,
                message,
                returnRequest: updatedReturnRequest,
                refund,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(
            "UPDATE RETURN AND CREATE REFUND ERROR:",
            error
        );

        if (error.code === 11000) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "A refund already exists for this return request. Refresh the page and check the Refund list.",
                },
                { status: 409 }
            );
        }

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update return request.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}
