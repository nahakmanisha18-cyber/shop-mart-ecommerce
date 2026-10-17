import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();

        const existingUser = await User.findOne({
            email: body.email,
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Account already exists. Please log in."
                },
                {
                    status: 409,
                }
            );
        }


        const hashedPassword = await bcrypt.hash(body.password, 10);

        const user = await User.create({
            ...body,
            password: hashedPassword,
        });

        return NextResponse.json(
            {
                success: true,
                user,
                message: "Register Success",
            },
            {
                status: 201,
            }
        );
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