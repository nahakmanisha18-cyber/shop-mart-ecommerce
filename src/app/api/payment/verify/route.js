

import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
    try {

        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = await request.json();

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(body)
                .digest("hex");

        const isValid = crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(razorpay_signature)
            );

        if (!isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid payment signature",
                },
                { status: 400 }
            );
        }

        

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
        });
    
        

    } catch (error) {

        console.error(
            "Payment Verification Error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Payment verification failed",
            },
            { status: 500 }
        );
    }
}