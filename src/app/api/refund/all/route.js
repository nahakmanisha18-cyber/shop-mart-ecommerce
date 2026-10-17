import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Refund from "@/lib/model/refund";
import User from "@/lib/model/user";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request) {
    try {
        await dbConnect();

        // 1. Verify logged-in user
        const user = await verifyToken(request);

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authentication required. Please login.",
                },
                { status: 401 }
            );
        }

        // 2. Build filter according to role
        const isAdmin =
            user.role === "admin" ||
            user.role === "Admin" ||
            user.isAdmin === true;

        const filter = isAdmin
            ? {}
            : { userId: user._id || user.id };

        // 3. Fetch refunds
        const refunds = await Refund.find(filter)
            .populate({
                path: "userId",
                select: "profileName email profileImage",
                model: User,
          })
            .populate({
                path: "orderId",
                select: "totalAmount paymentMethod paymentStatus",
            })
            .populate({
                path: "returnId",
                select: "status returnType totalRefundAmount requestedAt",
            })
            .sort({ createdAt: -1 })
            .lean();

        console.log(
            "REFUND CUSTOMER DETAILS:",
            refunds.map((refund) => ({
                userId: refund.userId?._id,
                profileName: refund.userId?.profileName,
                email: refund.userId?.email,
                profileImage: refund.userId?.profileImage,
            }))
              );

        // 4. Return response
        return NextResponse.json(
            {
                success: true,
                message: "Refunds fetched successfully.",
                total: refunds.length,
                refunds,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET ALL REFUNDS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch refunds.",
                error:
                    process.env.NODE_ENV === "development"
                        ? error.message
                        : undefined,
            },
            { status: 500 }
        );
    }
}