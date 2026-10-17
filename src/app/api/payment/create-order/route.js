import { NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export async function POST(request) {
    try {
        const { amount } = await request.json();

        if (!amount || amount <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid amount",
                },
                { status: 400 }
            );
        }

        const order = await razorpay.orders.create({
            amount: Math.round(amount * 100),
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        return NextResponse.json({
            success: true,
            order,
        });

    } catch (error) {

        console.error("Razorpay Order Error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}