import { NextResponse } from "next/server";

import Order from "@/lib/model/order";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = await params;

        let order;

        // =========================================
        // ADMIN
        // Admin can view any order
        // =========================================

        if (user.role === "admin") {
            order = await Order
                .findById(id)
                .populate(
                    "user",
                    "profileName email phoneNumber profileImage role"
                )
                .populate("items.product");
        }

        // =========================================
        // NORMAL USER
        // User can view only their own order
        // =========================================

        else {
            const userId = user.id || user._id;

            order = await Order
                .findOne({
                    _id: id,
                    user: userId,
                    orderStatus: {
                        $ne: "cancelled",
                    },
                })
                .populate("items.product");
        }

        // =========================================
        // ORDER NOT FOUND
        // =========================================

        if (!order) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Order not found",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                order,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "GET ORDER ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get order",
            },
            {
                status: 500,
            }
        );
    }
}