import { NextResponse } from "next/server";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";

export async function DELETE(request, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product ID is required",
                },
                { status: 400 }
            );
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Product not found",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Product deleted successfully",
                product,
            },
            { status: 200 }
        );

    } catch (error) {

        console.error("Delete Product Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to delete product",
            },
            { status: 500 }
        );
    }
}