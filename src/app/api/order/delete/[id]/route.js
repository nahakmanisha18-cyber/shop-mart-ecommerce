import { NextResponse } from "next/server";
import Order from "@/lib/model/order";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();

        // Verify logged-in user
        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first",
                },
                { status: 401 }
            );
        }

        // Only admin can delete order
        if (user.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied. Admin only.",
                },
                { status: 403 }
            );
        }

        // Get order ID from URL
        const { id } = await params;

        // Find order
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                { status: 404 }
            );
        }

       

        
        await Order.findByIdAndDelete(id);

        return NextResponse.json(
            {
                success: true,
                message: "Order deleted successfully",
                orderId: id,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error("DELETE ORDER ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete order",
            },
            { status: 500 }
        );
    }
}