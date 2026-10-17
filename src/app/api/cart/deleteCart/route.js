import { NextResponse } from "next/server";
import Cart from "@/lib/model/cart";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function DELETE(request) {

    try {

        await dbConnect();
        const decoded = verifyToken(request);

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

        const cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Cart not found",
                },
                {
                    status: 404,
                }
            );

        }

        const itemExists = cart.items.some(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );


        if (!itemExists) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Product is not in cart",
                },
                {
                    status: 404,
                }
            );

        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !==
                productId.toString()
        );

        await cart.save();

        await cart.populate(
            "items.product"
        );
        return NextResponse.json(
            {
                success: true,
                message: "Product removed from cart",
                cart,
            },
            {
                status: 200,
            }
        );


    } catch (error) {

        console.error( "Remove From Cart Error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Failed to remove product from cart",
            },
            {
                status: 500,
            }
        );

    }

}