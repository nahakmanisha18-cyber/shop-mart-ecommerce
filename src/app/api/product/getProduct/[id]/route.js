import { NextResponse } from "next/server";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(request, { params }) {
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

        console.log("Requested Product ID:", id);
        console.log("Connected Database:", Product.db.name);

        const product = await Product.findById(id);

        console.log(
            "Product Found:",
            product ? product._id.toString() : "NOT FOUND"
        );

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
                message: "Product get successfully",
                product,
            },
            { status: 200 }
        );

    } catch (error) {

        console.log("Get Product Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to get product",
            },
            { status: 500 }
        );
    }
}