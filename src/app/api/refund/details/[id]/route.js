
import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import Refund from "@/lib/model/refund";
import User from "@/lib/model/user";
import Order from "@/lib/model/order";
import Return from "@/lib/model/return";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        // 1. Verify logged-in user
        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login to view refund details.",
                },
                { status: 401 }
            );
        }

        // 2. Get dynamic refund ID
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid refund ID.",
                },
                { status: 400 }
            );
        }

        // 3. Check role
        const isAdmin =
            user.role === "admin" ||
            user.role === "Admin" ||
            user.isAdmin === true;

        // 4. Fetch refund with related details
        const refund = await Refund.findById(id)
            .populate({
                path: "userId",
                select: "profileName email profileImage phoneNumber",
                model: User,
            })
            .populate({
                path: "orderId",
                select:
                    "totalAmount paymentMethod paymentStatus razorpayOrderId razorpayPaymentId codPaymentId orderStatus createdAt",
                model: Order,
            })
            .populate({
                path: "returnId",
                select:
                    "returnId status returnType totalRefundAmount reason notes adminNotes requestedAt approvedAt createdAt",
                model: Return,
            })
            .lean();

        if (!refund) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Refund not found.",
                },
                { status: 404 }
            );
        }

        // 5. Customer can only view their own refund
        const loggedInUserId = String(user._id || user.id || "");
        const refundUserId = String(
            refund.userId?._id || refund.userId || ""
        );

        if (!isAdmin && loggedInUserId !== refundUserId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You are not allowed to view this refund.",
                },
                { status: 403 }
            );
        }

        // 6. Return details
        return NextResponse.json(
            {
                success: true,
                message: "Refund details fetched successfully.",
                refund,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET REFUND DETAILS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch refund details.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}
