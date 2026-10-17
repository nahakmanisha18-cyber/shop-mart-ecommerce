import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/model/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        await dbConnect();

        const body = await req.json();
        const user = await User.findOne({
            email: body.email,
        });

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not exists ",
                },
                {
                    status: 404,
                }
            );
        }

      const isMatch = await bcrypt.compare(
            body.password,
            user.password
        );

        if (!isMatch) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid Password",
                },
                {
                    status: 401,
                }
            );
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
            
        );
        console.log("JWT SECRET:", process.env.JWT_SECRET);
        const userData = user.toObject();
        delete userData.password;

        return NextResponse.json(
            {
                success: true,
                user: userData, 
                token,
                message: "Login Success",
            },
            {
                status: 200,
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