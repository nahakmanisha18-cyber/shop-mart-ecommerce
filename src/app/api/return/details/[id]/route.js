
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import Refund from "@/lib/model/refund";
import Return from "@/lib/model/return";
import User from "@/lib/model/user";
import Order from "@/lib/model/order";
import Product from "@/lib/model/product";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        // 1. Verify logged-in user
        const authUser = await verifyToken(request);

        if (!authUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first.",
                    data: null,
                },
                { status: 401 }
            );
        }

        // 2. Get dynamic ID from URL
        const { id } = await params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid return request ID.",
                    data: null,
                },
                { status: 400 }
            );
        }

        // 3. Ensure all referenced models are registered
        // Imports above also ensure these model files are loaded.
        if (
            !mongoose.models.Return ||
            !mongoose.models.User ||
            !mongoose.models.Order ||
            !mongoose.models.Product
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "A required database model is not registered.",
                    data: null,
                },
                { status: 500 }
            );
        }

        // 4. Get authenticated user ID and role
        const userId = authUser.id || authUser._id || authUser.userId;
        const role = String(authUser.role || "").toLowerCase();
        const isAdmin = role === "admin";

        if (
            !isAdmin &&
            (!userId || !mongoose.Types.ObjectId.isValid(String(userId)))
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid user information.",
                    data: null,
                },
                { status: 401 }
            );
        }

        // 5. Find one return request.
        // Normal users can only fetch their own request.
        const filter = {
            _id: new mongoose.Types.ObjectId(id),
            ...(isAdmin
                ? {}
                : {
                    userId: new mongoose.Types.ObjectId(String(userId)),
                }),
        };

        const returnRequest = await Return.findOne(filter)
            .populate({
                path: "userId",
                select: "profileName email phoneNumber profileImage address city state country pincode",
                model: User,
        })
            .populate({
                path: "orderId",
                select:
                    "_id totalAmount orderStatus paymentStatus createdAt shippingAddress",
                model: Order,
            })
            .populate({
                path: "items.productId",
                select:
                    "_id productName name title image imageUrl thumbnail images price discountPrice",
                model: Product,
            })
            .lean();

        // 6. Return not found
        if (!returnRequest) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Return request not found.",
                    data: null,
                },
                { status: 404 }
            );
        }

        const refund = await Refund.findOne({
            returnId: returnRequest._id,
        })
            .select(
                "status amount currency paymentMethod paymentId razorpayPaymentId razorpayRefundId payoutReference initiatedAt processedAt failedAt failureReason"
            )
            .lean();


        const returnRequestWithRefund = {
            ...(typeof returnRequest.toObject === "function"
                ? returnRequest.toObject()
                : returnRequest),
            refund: refund || null,
            refundStatus: refund?.status || "",
        };
            

        // 7. Send real database data

        return NextResponse.json(
            {
                success: true,
                message: "Return request details fetched successfully.",
                data: returnRequestWithRefund,
                returnRequest: returnRequestWithRefund,
            },
            { status: 200 }
        );
        

    } catch (error) {
        console.error("GET RETURN REQUEST DETAILS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch return request details.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
                data: null,
            },
            { status: 500 }
        );
    }
}
