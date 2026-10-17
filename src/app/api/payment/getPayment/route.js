import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Order from "@/lib/model/order";

export async function GET() {
    try {
        await dbConnect();

        const orders = await Order.find()
            .populate("user", "profileName email profileImage")
            .sort({ createdAt: -1 })
            .lean();

            const payments = orders.map((order) => ({
                _id: order._id.toString(),
                orderId: order._id.toString(),
            
                paymentId:
                    order.paymentMethod === "cod"
                        ? order.codPaymentId || ""
                        : order.razorpayPaymentId || "",
            
                codPaymentId: order.codPaymentId || "",
                razorpayPaymentId: order.razorpayPaymentId || "",
                razorpayOrderId: order.razorpayOrderId || "",
            
                orderStatus: order.orderStatus || "pending",
            
                customer:
                    order.user?.profileName || "Unknown Customer",
            
                email: order.user?.email || "",
                profileImage: order.user?.profileImage || "",
            
                date: order.createdAt,
                amount: order.totalAmount || 0,
                method: order.paymentMethod || "N/A",
                status: order.paymentStatus || "pending",
            }));            

        return NextResponse.json({
            success: true,
            payments,
            message: "Get Payment API is working",
        });
    } catch (error) {
        console.error("Get Payments Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch payments",
            },
            { status: 500 }
        );
    }
}
