import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
       
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                productName: {
                    type: String,
                    required: true,
                },
                
                category: {
                    type: String,
                    trim: true,
                },

                image: {
                    type: String,
                    default: "",
                },

                price: {
                    type: Number,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
            },
        ],

        paymentTimeline: [
            {
                status: {
                    type: String,
                    enum: [
                        "initiated",
                        "processing",
                        "paid",
                        "failed",
                        "refunded",
                    ],
                    required: true,
                },
                message: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        
        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            mobile: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            state: {
                type: String,
                required: true,
            },

            pincode: {
                type: String,
                required: true,
            },
        },

        subtotal: {
            type: Number,
            required: true,
        },

        deliveryCharge: {
            type: Number,
            default: 0,
        },

        totalAmount: {
            type: Number,
            required: true,
        },


        paymentMethod: {
            type: String,
            enum: ["razorpay", "cod"],
            default: "razorpay",
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
            ],
            default: "pending",
        },

        razorpayOrderId: {
            type: String,
            default: "",
        },

        razorpayPaymentId: {
            type: String,
            default: "",
        },

        codPaymentId: {
            type: String,
            default: "",
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "pending",
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                        "cancelled",
                    ],
                    required: true,
                },
                date: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
    },

    {
        timestamps: true,
    }
);

const Order =
    mongoose.models.Order ||
    mongoose.model("Order", orderSchema);

export default Order;