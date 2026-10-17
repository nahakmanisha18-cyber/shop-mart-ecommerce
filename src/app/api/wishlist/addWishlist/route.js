import { NextResponse } from "next/server";

import Wishlist from "@/lib/model/wishlist";
import Product from "@/lib/model/product";

import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(request) {
    try {
        await dbConnect();

        const decoded = verifyToken(request);

        console.log("ADD WISHLIST DECODED USER:", decoded);

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

      

        const body = await request.json();

        const { productId } = body;

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

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        let wishlist = await Wishlist.findOne({
            user: userId,
        });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: userId,
                products: [productId],
            });
        }

        else {
            const alreadyExists = wishlist.products.some(
                (item) =>
                    item.toString() === productId.toString()
            );


            if (alreadyExists) {
                return NextResponse.json(
                    {
                        success: false,
                        message: "Product is already in wishlist",
                        wishlist,
                    },
                    {
                        status: 409,
                    }
                );
            }

            wishlist.products.push(productId);

            await wishlist.save();
        }

        await wishlist.populate("products");

        return NextResponse.json(
            {
                success: true,
                message: "Product added to wishlist successfully",
                wishlist,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(
            "ADD WISHLIST API ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add product to wishlist",
            },
            {
                status: 500,
            }
        );
    }
}