import { NextResponse } from "next/server";
import Cart from "@/lib/model/cart";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(request) {
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
        const {  productId,  quantity = 1} = body;
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

        const product = await Product.findById(
            productId
        );

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

        let cart = await Cart.findOne({
            user: userId,
        });

        if (!cart) {

            cart = await Cart.create({

                user: userId,

                items: [
                    {
                        product: productId,
                        quantity: quantity,
                    },
                ],

            });

        } else {

            const existingItem =
                cart.items.find(
                    (item) =>
                        item.product.toString() ===
                        productId.toString()
                );

            if (existingItem) {
                existingItem.quantity += quantity;

            } else {
                cart.items.push({
                    product: productId,
                    quantity: quantity,
                });

            }

            await cart.save();
        }


        await cart.populate(
            "items.product"
        );

        return NextResponse.json(
            {
                success: true,
                message: "Product added to cart successfully",
                cart,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.error(
            "Add To Cart Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to add product to cart",
            },
            {
                status: 500,
            }
        );
    }
}