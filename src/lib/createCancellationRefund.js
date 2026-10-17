
import Refund from "@/lib/model/refund";

export async function createCancellationRefund(order) {
    if (!order?._id || !order?.user) {
        throw new Error("Order ID or customer ID is missing.");
    }

    const paymentMethod = String(order.paymentMethod || "")
        .trim()
        .toLowerCase();

    const paymentStatus = String(order.paymentStatus || "")
        .trim()
        .toLowerCase();

    // COD: cancellation ke liye refund record nahi banana.
    if (paymentMethod === "cod") {
        return null;
    }

    // Sirf successfully paid Razorpay orders ke liye refund.
    if (paymentMethod !== "razorpay" || paymentStatus !== "paid") {
        return null;
    }

    const paymentId = String(order.razorpayPaymentId || "").trim();

    if (!paymentId.startsWith("pay_")) {
        throw new Error(
            "Paid Razorpay order has no valid razorpayPaymentId."
        );
    }

    const amount = Number(order.totalAmount);

    if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Invalid order refund amount.");
    }

    // Ek cancelled order ke liye ek hi cancellation refund.
    const existingRefund = await Refund.findOne({
        orderId: order._id,
        refundType: "cancellation",
    });

    if (existingRefund) {
        return existingRefund;
    }

    try {
        return await Refund.create({
            orderId: order._id,
            userId: order.user,
            returnId: null,

            amount,
            currency: "INR",

            refundType: "cancellation",
            paymentMethod: "razorpay",

            paymentId,
            razorpayPaymentId: paymentId,

            status: "pending",

            reason: "Order cancelled before delivery",
            adminNotes:
                "Cancellation refund created. Awaiting admin processing.",
        });
    } catch (error) {
        // Concurrent request se duplicate create hone par
        // existing record return karein.
        if (error.code === 11000) {
            const existingRefund = await Refund.findOne({
                orderId: order._id,
                refundType: "cancellation",
            });

            if (existingRefund) {
                return existingRefund;
            }
        }

        throw error;
    }
}
