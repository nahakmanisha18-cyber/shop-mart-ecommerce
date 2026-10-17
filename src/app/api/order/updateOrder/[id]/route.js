
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import Order from "@/lib/model/order";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

function generateCodPaymentId() {
    return `COD-PAY-${randomBytes(4)
        .toString("hex")
        .toUpperCase()}`;
}

export async function PUT(request, { params }) {
    try {
        await dbConnect();

        // 1. Verify user
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

        // 2. Admin check
        if (user.role !== "admin") {
            return NextResponse.json(
                {
                    success: false,
                    message: "Access denied. Admin only.",
                },
                { status: 403 }
            );
        }

        // 3. Get order ID
        const { id } = await params;

        // 4. Request body
        const body = await request.json();

        const {
            paymentMethod,
            paymentStatus,
            orderStatus,
        } = body;

        // 5. Find order
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

        const oldOrderStatus = order.orderStatus;
        const oldPaymentStatus = order.paymentStatus;

        // 6. Validate requested payment method
        if (
            paymentMethod !== undefined &&
            !["razorpay", "cod"].includes(paymentMethod)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment method",
                },
                { status: 400 }
            );
        }

        // Do not allow the admin UI to mark an unpaid order as paid
        // independently of the delivery/payment handling.
        if (
            paymentStatus !== undefined &&
            !["pending", "paid", "failed"].includes(paymentStatus)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment status",
                },
                { status: 400 }
            );
        }

        // 7. Initialize history
        if (!order.statusHistory) {
            order.statusHistory = [];
        }

        if (order.statusHistory.length === 0) {
            order.statusHistory.push({
                status: oldOrderStatus,
                date: order.createdAt || new Date(),
            });
        }

        if (!order.paymentTimeline) {
            order.paymentTimeline = [];
        }

        // 8. Update payment method if supplied
        if (paymentMethod !== undefined) {
            order.paymentMethod = paymentMethod;
        }

        // 9. Update order status
        if (orderStatus !== undefined) {
            if (
                ![
                    "pending",
                    "confirmed",
                    "processing",
                    "shipped",
                    "delivered",
                    "cancelled",
                ].includes(orderStatus)
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid order status",
                    },
                    { status: 400 }
                );
            }

            if (oldOrderStatus !== orderStatus) {
                order.statusHistory.push({
                    status: orderStatus,
                    date: new Date(),
                });
            }

            order.orderStatus = orderStatus;
        }

        // 10. COD payment handling on delivery
        const isNewlyDelivered =
            orderStatus === "delivered" &&
            oldOrderStatus !== "delivered";

        if (
            isNewlyDelivered &&
            order.paymentMethod === "cod"
        ) {
            // Generate the ID only once
            if (!order.codPaymentId) {
                order.codPaymentId = generateCodPaymentId();
            }

            // Mark COD as paid only if delivery confirms
            // the cash was collected successfully.
            if (oldPaymentStatus !== "paid") {
                order.paymentStatus = "paid";

                order.paymentTimeline.push({
                    status: "paid",
                    message:
                        "COD payment received on delivery.",
                    timestamp: new Date(),
                });
            }
        } else if (paymentStatus !== undefined) {
            // Preserve explicit payment updates for other cases.
            // Do not overwrite a COD payment received at delivery.
            if (
                !(
                    order.paymentMethod === "cod" &&
                    order.paymentStatus === "paid"
                )
            ) {
                order.paymentStatus = paymentStatus;
            }
        }

        // 11. Save order
        await order.save();

        // 12. Fetch updated order
        const updatedOrder = await Order.findById(id)
            .populate(
                "user",
                "profileName email phoneNumber profileImage role"
            )
            .populate("items.product");

        return NextResponse.json(
            {
                success: true,
                message: "Order updated successfully",
                order: updatedOrder,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("UPDATE ORDER ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update order",
            },
            { status: 500 }
        );
    }
}