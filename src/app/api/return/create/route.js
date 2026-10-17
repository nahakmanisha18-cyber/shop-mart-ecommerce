
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect";
import Order from "@/lib/model/order";
import Return from "@/lib/model/return";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
    try {
        // 1. Connect to MongoDB
        await dbConnect();

        // 2. Verify logged-in user using existing utility
        const decoded = verifyToken(req);

        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid or expired token. Please login again.",
                },
                { status: 401 }
            );
        }

        const userId = decoded.userId || decoded.id || decoded._id;

        if (
            !userId ||
            !mongoose.Types.ObjectId.isValid(userId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid user information in token.",
                },
                { status: 401 }
            );
        }

        // 3. Read request body
        const body = await req.json();

        const {
            orderId,
            items,
            returnType,
        } = body;

        // 4. Validate order ID
        if (
            !orderId ||
            !mongoose.Types.ObjectId.isValid(orderId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Valid order ID is required.",
                },
                { status: 400 }
            );
        }

        // 5. Validate selected items
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Select at least one item to return.",
                },
                { status: 400 }
            );
        }

        if (!["full", "partial"].includes(returnType)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return type.",
                },
                { status: 400 }
            );
        }

        // 6. Find order belonging to the logged-in user
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        }).lean();

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found.",
                },
                { status: 404 }
            );
        }

        // 7. Only delivered orders can be returned
        if (
            String(order.orderStatus || "").toLowerCase() !==
            "delivered"
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Only delivered orders can be returned.",
                },
                { status: 400 }
            );
        }

        // 8. Validate order items
        const orderItems = order.items || [];

        if (orderItems.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "No items found in this order.",
                },
                { status: 400 }
            );
        }

        const returnItems = [];
        const selectedProductIds = new Set();

        let totalRefundAmount = 0;

        const validReasons = [
            "damaged",
            "wrong_product",
            "defective",
            "not_as_described",
            "size_issue",
            "other",
        ];

        // 9. Validate every requested product
        for (const selectedItem of items) {
            const {
                productId,
                quantity,
                reason: itemReason,
                notes: itemNotes = "",
            } = selectedItem || {};

            if (
                typeof productId !== "string" ||
                !mongoose.Types.ObjectId.isValid(productId) ||
                !Number.isInteger(Number(quantity)) ||
                Number(quantity) < 1
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid product or quantity.",
                    },
                    { status: 400 }
                );
            }

            if (!validReasons.includes(itemReason)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Please select a valid return reason.",
                    },
                    { status: 400 }
                );
            }

            if (
                typeof itemNotes !== "string" ||
                itemNotes.length > 500
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Notes must be 500 characters or fewer.",
                    },
                    { status: 400 }
                );
            }

            const normalizedProductId = String(productId);

            // Prevent duplicate product entries in one request
            if (selectedProductIds.has(normalizedProductId)) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "A product can only be selected once per request.",
                    },
                    { status: 400 }
                );
            }

            selectedProductIds.add(normalizedProductId);

            // Find the selected product in the purchased order
            const orderItem = orderItems.find((item) => {
                const purchasedProductId =
                    item.product?._id?.toString() ||
                    item.product?.toString() ||
                    item.productId?._id?.toString() ||
                    item.productId?.toString();

                return purchasedProductId === normalizedProductId;
            });

            if (!orderItem) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Selected product does not belong to this order.",
                    },
                    { status: 400 }
                );
            }

            // 10. Validate return quantity
            const orderedQuantity = Number(orderItem.quantity);
            const returnQuantity = Number(quantity);

            if (
                !Number.isInteger(orderedQuantity) ||
                orderedQuantity < 1 ||
                returnQuantity > orderedQuantity
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Return quantity cannot exceed ordered quantity.",
                    },
                    { status: 400 }
                );
            }

            // 11. Get product name and unit price from the order
            const productName =
                orderItem.productName ||
                orderItem.name ||
                orderItem.product?.productName ||
                orderItem.product?.name;

            const price = Number(
                orderItem.price ??
                orderItem.discountPrice ??
                orderItem.salePrice ??
                orderItem.productPrice
            );

            if (
                !productName ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product name or price is missing in the order.",
                    },
                    { status: 400 }
                );
            }

            // 12. Prevent another active return request
            // for the same product in this order
            const existingReturn = await Return.findOne({
                orderId: order._id,
                userId,
                status: {
                    $in: ["pending", "approved", "received"],
                },
                "items.productId": new mongoose.Types.ObjectId(
                    normalizedProductId
                ),
            }).lean();

            if (existingReturn) {
                return NextResponse.json(
                    {
                        success: false,
                        message: `${productName} already has an active return request.`,
                    },
                    { status: 409 }
                );
            }

            // 13. Prepare item data
            returnItems.push({
                productId: new mongoose.Types.ObjectId(
                    normalizedProductId
                ),
                productName,
                quantity: returnQuantity,
                price,
                reason: itemReason,
                notes: itemNotes.trim(),
            });

            totalRefundAmount += price * returnQuantity;
        }

        // 14. Verify the return type on the server
        const isFullReturn =
            returnItems.length === orderItems.length &&
            returnItems.every((returnItem) => {
                const orderItem = orderItems.find((item) => {
                    const id =
                        item.product?._id?.toString() ||
                        item.product?.toString() ||
                        item.productId?._id?.toString() ||
                        item.productId?.toString();

                    return id === returnItem.productId.toString();
                });

                return (
                    orderItem &&
                    Number(returnItem.quantity) ===
                    Number(orderItem.quantity)
                );
            });

        if (
            (returnType === "full" && !isFullReturn) ||
            (returnType === "partial" && isFullReturn)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Return type does not match the selected items and quantities.",
                },
                { status: 400 }
            );
        }
        // 16. Save the return request in MongoDB
        const returnRequest = await Return.create({
            orderId: order._id,
            userId: new mongoose.Types.ObjectId(userId),
            items: returnItems,
            returnType,
            totalRefundAmount: Number(totalRefundAmount.toFixed(2)),
            reason: returnItems[0].reason,
            notes: returnItems[0].notes,
            status: "pending",
            requestedAt: new Date(),
        });

        // 17. Return success response
        return NextResponse.json(
            {
                success: true,
                message: "Return request created successfully.",
                data: returnRequest,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("CREATE RETURN ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to create return request.",
            },
            { status: 500 }
        );
    }
}
