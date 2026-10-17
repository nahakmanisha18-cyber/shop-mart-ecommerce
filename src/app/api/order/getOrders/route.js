import { NextResponse } from "next/server";

import Order from "@/lib/model/order";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request) {
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

        let orders;

        // =========================
        // ADMIN → ALL ORDERS
        // =========================

        if (user.role === "admin") {

            orders = await Order
                .find()
                .populate("user", "profileName email profileImage")
                .populate("items.product")
                .sort({
                    createdAt: -1,
                });

        }

        // =========================
        // USER → OWN ORDERS
        // =========================

        else {

            const userId = user.id || user._id;

            orders = await Order
                .find({
                    user: userId,
                    orderStatus: {
                        $ne: "cancelled",
                    },
                })
                .populate("items.product")
                .sort({
                    createdAt: -1,
                });

        }

        console.log(
            "GET ORDERS:",
            orders
        );

        return NextResponse.json(
            {
                success: true,
                orders,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "GET ORDERS ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get orders",
            },
            {
                status: 500,
            }
        );

    }
}