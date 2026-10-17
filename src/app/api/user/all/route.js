
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";
import User from "@/lib/model/user";

export async function GET(request) {
    try {
        await dbConnect();

        const decoded = await verifyToken(request);

        if (!decoded) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 }
            );
        }

        const isAdmin =
            String(decoded.role || "").toLowerCase() === "admin" ||
            decoded.isAdmin === true;

        if (!isAdmin) {
            return NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
        }

        const users = await User.find({
            role: { $nin: ["admin", "Admin", "ADMIN"] },
        })
            .select(
                "_id profileName email phoneNumber profileImage role isVerified isBlocked lastLogin createdAt"
            )
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error("GET ALL USERS ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}