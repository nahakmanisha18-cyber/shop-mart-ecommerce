import { NextResponse } from "next/server";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";

export async function PUT(request, { params }) {
    try {

        await dbConnect();

        const { id } = await params;

        if (!id) {
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

        const body = await request.json();
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedProduct) {
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
        return NextResponse.json(
            {
                success: true,
                message: "Product updated successfully",
                product: updatedProduct,
            },
            {
                status: 200,
            }
        );

    } catch (error) {

        console.log("Update Product Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to update product",
            },
            {
                status: 500,
            }
        );
    }
}