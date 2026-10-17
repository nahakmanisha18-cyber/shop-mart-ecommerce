
import { NextResponse } from "next/server";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

import Order from "@/lib/model/order";
import Product from "@/lib/model/product";

import { createCancellationRefund } from "@/lib/createCancellationRefund";

const sendError = (message, status = 400) => {
    return NextResponse.json(
        { success: false, message },
        { status }
    );
};

export async function PATCH(request, { params }) {
    try {
        await dbConnect();

        // 1. Verify logged-in user
        const user = await verifyToken(request);

        if (!user) {
            return sendError("Please login first.", 401);
        }

        const { id } = await params;
        const userId = user.id || user._id;

        // 2. Find only this user's order
        const order = await Order.findOne({
            _id: id,
            user: userId,
        });

        if (!order) {
            return sendError("Order not found.", 404);
        }

        const currentStatus = String(order.orderStatus || "")
            .trim()
            .toLowerCase();

        // 3. Do not cancel shipped or delivered orders
        if (currentStatus === "delivered") {
            return sendError(
                "Delivered orders cannot be cancelled. Please request a return."
            );
        }

        if (currentStatus === "shipped") {
            return sendError("Shipped orders cannot be cancelled.");
        }

        // 4. Only allow eligible order statuses
        if (currentStatus === "cancelled") {
            // Retry can repair a missing online cancellation refund.
            // Stock is NOT restored again in this branch.
            const refund = await createCancellationRefund(order);

            return NextResponse.json({
                success: true,
                message: refund
                    ? "Order is already cancelled. Refund is pending admin processing."
                    : "Order is already cancelled. No online cancellation refund is required.",
                order,
                refund,
            });
        }

        const allowedStatuses = [
            "pending",
            "processing",
            "confirmed",
        ];

        if (!allowedStatuses.includes(currentStatus)) {
            return sendError(
                "This order cannot be cancelled at its current status."
            );
        }

        // 5. Cancel and save order first
        order.orderStatus = "cancelled";

        if (!order.statusHistory) {
            order.statusHistory = [];
        }

        order.statusHistory.push({
            status: "cancelled",
            date: new Date(),
        });

        await order.save();

        // 6. Restore product stock for the first cancellation only
        for (const item of order.items || []) {
            if (!item.product) continue;

            const quantity = Number(item.quantity);

            if (!Number.isFinite(quantity) || quantity <= 0) {
                continue;
            }

            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: quantity },
            });
        }

        // 7. Online paid order -> create pending refund.
        // COD or unpaid order -> helper returns null.
        const refund = await createCancellationRefund(order);

        const paymentMethod = String(order.paymentMethod || "")
            .trim()
            .toLowerCase();

        let message;

        if (refund) {
            message =
                "Order cancelled successfully. Your refund is pending admin processing.";
        } else if (paymentMethod === "cod") {
            message =
                "COD order cancelled successfully. No online refund is required.";
        } else {
            message =
                "Order cancelled successfully. No paid Razorpay refund is required.";
        }

        return NextResponse.json(
            {
                success: true,
                message,
                order,
                refund,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("CANCEL ORDER API ERROR:", {
            message: error?.message,
            name: error?.name,
            code: error?.code,
        });

        return NextResponse.json(
            {
                success: false,
                message:
                    "Cancellation may have been saved, but refund processing setup failed. Please retry or check the order and refund records.",
                ...(process.env.NODE_ENV === "development" && {
                    debug: error?.message,
                    code: error?.code,
                }),
            },
            { status: 500 }
        );
    }
}
