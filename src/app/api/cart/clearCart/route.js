import { NextResponse } from "next/server";
import Cart from "@/lib/model/cart";
import { verifyToken } from "@/lib/verifyToken";
import { dbConnect } from "@/lib/dbConnect";

export async function DELETE(request) {
    try {
        await dbConnect();

       

        const decoded = verifyToken(request);

        console.log("CLEAR CART DECODED USER:", decoded);

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
        });

        

        if (!cart) {
            return NextResponse.json(
                {
                    success: true,
                    message: "Cart is already empty",
                    cart: {
                        items: [],
                    },
                },
                {
                    status: 200,
                }
            );
        }

        

        cart.items = [];

        await cart.save();

        return NextResponse.json(
            {
                success: true,
                message: "Cart cleared successfully",
                cart,
            },
            {
                status: 200,
            }
        );

    } catch (error) {
        console.error(
            "CLEAR CART API ERROR:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Failed to clear cart",
            },
            {
                status: 500,
            }
        );
    }
}