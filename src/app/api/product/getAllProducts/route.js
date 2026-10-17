import { NextResponse } from "next/server";
import Product from "@/lib/model/product";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
    try {
        await dbConnect();

        const products = await Product.find();

        return NextResponse.json(
            {
                success: true,
                message: "Products fetched successfully",
                products,
            },
            { status: 200 }
        );

    } catch (error) {

        console.log("Get Products Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Failed to fetch products",
            },
            { status: 500 }
        );
    }
}