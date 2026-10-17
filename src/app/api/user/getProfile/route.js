import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");

        if (!email) {
            return NextResponse.json(
                { success: false, message: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

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
        console.log("GET USER ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}