import { NextResponse } from "next/server";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
    try {
        await dbConnect();
        const body = await request.json();
        const product = await Product.create(body);

        return NextResponse.json(
            {
                success: true,
                message: "Product added successfully",
                product,
            },
            { status: 201 }
        );

    } catch (error) {

        console.error("Add Product Error:", error);       
        return NextResponse.json(
            {
                success: false,
                message: "Failed to add product",
            },
            { status: 500 }
        );
    }
}