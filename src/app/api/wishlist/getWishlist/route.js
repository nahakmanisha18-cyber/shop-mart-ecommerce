import { NextResponse } from "next/server";

import Wishlist from "@/lib/model/wishlist";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request) {
    try {
        await dbConnect();

        const decoded = verifyToken(request);

        console.log("GET WISHLIST DECODED USER:", decoded);

        if (!decoded) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login first",
                },
                {
                    status: 401,
                }
            );
        }

        const userId = decoded.id;

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid user token",
                },
                {
                    status: 401,
                }
            );
        }

        let wishlist = await Wishlist.findOne({
            user: userId,
        }).populate("products");

        // User ki wishlist nahi hai
        if (!wishlist) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Wishlist is empty",
                    wishlist: {
                        user: userId,
                        products: [],
                    },
                },
                {
                    status: 200,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Wishlist fetched successfully",
                wishlist,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error("GET WISHLIST API ERROR:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch wishlist",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}