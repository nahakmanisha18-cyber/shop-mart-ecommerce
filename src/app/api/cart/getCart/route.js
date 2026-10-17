import { NextResponse } from "next/server";
import Cart from "@/lib/model/cart";
import { dbConnect } from "@/lib/dbConnect";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(request) {

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

        const cart = await Cart.findOne({
            user: userId,
        }).populate("items.product");


        if (!cart) {

            return NextResponse.json(
                {
                    success: true,
                    message: "Cart is empty",
                    cart: {
                        user: userId,
                        items: [],
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
                message: "Cart fetched successfully",
                cart,
            },
            {
                status: 200,
            }
        );


    } catch (error) {

        console.error(
            "Get Cart Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get cart",
            },
            {
                status: 500,
            }
        );

    }

}