import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";

export async function GET() {
    try {
        await dbConnect();

        const userCount = await User.countDocuments({
            role: "user",
        });

        return NextResponse.json({
            success: true,
            count: userCount,
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );
    }
}