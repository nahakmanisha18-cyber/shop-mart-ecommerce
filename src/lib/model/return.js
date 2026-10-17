
import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
    {

        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                productName: {
                    type: String,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },

                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },

                reason: {
                    type: String,
                    default: "",
                },

                notes: {
                    type: String,
                    default: "",
                },
            },
        ],

        returnType: {
            type: String,
            enum: ["full", "partial"],
            required: true,
        },

        totalRefundAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        reason: {
            type: String,
            required: true,
        },

        notes: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
                "received",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        adminNotes: {
            type: String,
            default: "",
        },

        requestedAt: {
            type: Date,
            default: Date.now,
        },

        approvedAt: {
            type: Date,
            default: null,
        },

        receivedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Return =
    mongoose.models.Return ||
    mongoose.model("Return", returnSchema);

export default Return;
