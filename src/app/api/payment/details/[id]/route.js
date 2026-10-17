import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/lib/model/order";

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        await dbConnect();

        // const { searchParams } = new URL(request.url);
        // const id = searchParams.get("id");

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid payment/order ID is required",
                },
                { status: 400 }
            );
        }

        const order = await Order.findById(id)
            .populate(
                "user",
                "profileName email profileImage phoneNumber address city state country pincode"
            )
            .lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Payment details not found",
                },
                { status: 404 }
            );
        }

        const user = order.user || {};


        const payment = {
            _id: String(order._id),
            orderId: String(order._id),

            // COD Payment ID
            codPaymentId: order.codPaymentId || "",

            // Payment IDs
            paymentId:
                order.paymentMethod === "cod"
                    ? order.codPaymentId || ""
                    : order.razorpayPaymentId || "",

            transactionId:
                order.paymentMethod === "cod"
                    ? order.codPaymentId || ""
                    : order.razorpayPaymentId || "",

            razorpayPaymentId: order.razorpayPaymentId || "",
            razorpayOrderId: order.razorpayOrderId || "",

            // Status fields
            orderStatus: order.orderStatus || "pending",
            paymentTimeline: order.paymentTimeline || [],

            customer: {
                name: user.profileName || "Unknown Customer",
                email: user.email || "",
                profileImage: user.profileImage || "",
                phone: user.phoneNumber || "",
                address: [
                    user.address,
                    user.city,
                    user.state,
                    user.country,
                    user.pincode,
                ].filter(Boolean).join(", "),
            },

            date: order.createdAt || null,
            amount: order.totalAmount || 0,
            method: order.paymentMethod || "N/A",
            status: order.paymentStatus || "pending",
            gateway:
                order.paymentMethod === "cod" ? "Cash on Delivery" : "Razorpay",
            currency: "INR",
            description: `Payment for order ${order._id}`,
        };

        return NextResponse.json({
            success: true,
            payment,
        });
    }  catch (error) {
    console.error("Payment Details API Error:", error);

    return NextResponse.json(
        {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch payment details",
        },
        { status: 500 }
    );
}
}