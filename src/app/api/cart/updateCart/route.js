import { NextResponse } from "next/server";
import Cart from "@/lib/model/cart";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function PUT(request) {

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
        const { productId, quantity} = body;
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

        if (
            quantity === undefined ||
            quantity === null
        ) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Quantity is required",
                },
                {
                    status: 400,
                }
            );

        }
        if (quantity < 1) {

            return NextResponse.json(
                {
                    success: false,
                    message: "Quantity must be at least 1",
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


        const cartItem = cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );


        if (!cartItem) {

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


        cartItem.quantity = quantity;


        await cart.save();


        await cart.populate(
            "items.product"
        );


        return NextResponse.json(
            {
                success: true,
                message: "Cart updated successfully",
                cart,
            },
            {
                status: 200,
            }
        );


    } catch (error) {

        console.error(
            "Update Cart Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update cart",
            },
            {
                status: 500,
            }
        );

    }

}