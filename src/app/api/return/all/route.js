
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

import Return from "@/lib/model/return";
import User from "@/lib/model/user";
import Order from "@/lib/model/order";
import Product from "@/lib/model/product";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        // 1. Connect to MongoDB
        await dbConnect();

        // 2. Verify authentication
        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                    data: [],
                },
                { status: 401 }
            );
        }

        // 3. Verify registered models before populate
        // Importing these models ensures their schemas are loaded.
        if (
            !mongoose.models.User ||
            !mongoose.models.Order ||
            !mongoose.models.Product ||
            !mongoose.models.Return
        ) {
            console.error("Return API: Required Mongoose model is missing.");

            return NextResponse.json(
                {
                    success: false,
                    message: "A required database model is not registered.",
                    data: [],
                },
                { status: 500 }
            );
        }

        // 4. Identify user and role
        const userId = user.id || user._id || user.userId;

        const role = String(user.role || "").toLowerCase();

        const isAdmin = role === "admin";

        // 5. Admin can see every request.
        // Normal users can only see their own requests.
        let filter = {};

        if (!isAdmin) {
            if (
                !userId ||
                !mongoose.Types.ObjectId.isValid(String(userId))
            ) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Invalid user information.",
                        data: [],
                    },
                    { status: 401 }
                );
            }

            filter = {
                userId: new mongoose.Types.ObjectId(String(userId)),
            };
        }

        // 6. Fetch return requests
        const returnRequests = await Return.find(filter)
            .populate({
                path: "userId",
                select: "fullName profileName name email profileImage",
                model: User,
            })
            .populate({
                path: "orderId",
                select: "_id totalAmount orderStatus paymentStatus createdAt",
                model: Order,
            })
            .populate({
                path: "items.productId",
                select: "productName name title image imageUrl thumbnail images price discountPrice",
                model: Product,
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log("GET RETURN REQUESTS:", {
            role,
            isAdmin,
            filter,
            count: returnRequests.length,
        });

        // 7. Return consistent response for the frontend
        return NextResponse.json(
            {
                success: true,
                message: "Return requests fetched successfully.",
                data: returnRequests,
                returnRequests,
                total: returnRequests.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET ALL RETURN REQUESTS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch return requests.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
                data: [],
            },
            { status: 500 }
        );
    }
}