import { NextResponse } from "next/server";

import Wishlist from "@/lib/model/wishlist";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(request) {
    try {
        await dbConnect();

        const decoded = verifyToken(request);

        console.log(
            "REMOVE WISHLIST DECODED USER:",
            decoded
        );

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

        const { productId } = await request.json();

        if (!productId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product ID is required",
                },
                {
                    status: 400,
                }
            );
        }

        const wishlist = await Wishlist.findOne({
            user: userId,
        });

        if (!wishlist) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Wishlist not found",
                },
                {
                    status: 404,
                }
            );
        }

        wishlist.products = wishlist.products.filter(
            (id) =>
                id.toString() !== productId.toString()
        );

        await wishlist.save();


        // IMPORTANT
        // Remove ke baad products ko dobara populate karo
        await wishlist.populate("products");


        return NextResponse.json(
            {
                success: true,
                message: "Product removed from wishlist",
                wishlist,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "REMOVE WISHLIST ROUTE ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove wishlist",
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}