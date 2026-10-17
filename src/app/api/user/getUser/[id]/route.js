import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request, { params }) {
    try {
        await dbConnect();

        // Admin authentication
        const auth = await verifyToken(request);

        if (!auth) {
            return NextResponse.json(
                { success: false, message: "Unauthorized access" },
                { status: 401 }
            );
        }

        // Adjust this role check if your verifyToken returns a different shape.
        const role = String(auth.role || auth.user?.role || "").toLowerCase();

        if (role !== "admin") {
            return NextResponse.json(
                { success: false, message: "Admin access required" },
                { status: 403 }
            );
        }

        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID" },
                { status: 400 }
            );
        }

        const user = await User.findById(id)
            .select(
                "_id profileName email phoneNumber gender dateOfBirth address city state country pincode profileImage role isVerified isBlocked lastLogin createdAt updatedAt"
            )
            .lean();

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                user,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("GET USER DETAILS ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch user details",
            },
            { status: 500 }
        );
    }
}