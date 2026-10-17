import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";

export async function PUT(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const {
            email,
            profileName,
            phoneNumber,
            gender,
            dateOfBirth,
            address,
            city,
            state,
            country,
            pincode,
            profileImage,
        } = body;

        if (!email) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Email is required",
                },
                { status: 400 }
            );
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                profileName,
                phoneNumber,
                gender,
                dateOfBirth,
                address,
                city,
                state,
                country,
                pincode,
                profileImage,
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Profile Updated Successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Update Profile Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}