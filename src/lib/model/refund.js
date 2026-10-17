
import mongoose from "mongoose";

const refundSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            index: true,
        },

        // Cancellation refunds do not have a Return document.
        returnId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Return",
            default: null,
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        paymentId: {
            type: String,
            default: "",
            trim: true,
        },

        paymentMethod: {
            type: String,
            enum: ["razorpay", "cod"],
            required: true,
        },

        codPaymentId: {
            type: String,
            default: "",
            trim: true,
        },

        razorpayPaymentId: {
            type: String,
            default: "",
            trim: true,
        },

        payoutReference: {
            type: String,
            default: "",
            trim: true,
        },

        razorpayRefundId: {
            type: String,
            default: "",
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 0.01,
        },

        currency: {
            type: String,
            default: "INR",
            uppercase: true,
            trim: true,
        },

        refundType: {
            type: String,
            enum: ["full", "partial", "cancellation"],
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "processed",
                "failed",
                "cancelled",
            ],
            default: "pending",
            index: true,
        },

        reason: {
            type: String,
            trim: true,
            default: "",
        },

        adminNotes: {
            type: String,
            trim: true,
            default: "",
        },

        failureReason: {
            type: String,
            default: "",
        },

        receipt: {
            type: String,
            trim: true,
            default: "",
        },

        initiatedAt: {
            type: Date,
            default: null,
        },

        processedAt: {
            type: Date,
            default: null,
        },

        failedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// A Return can have only one Refund record.
// Cancellation refunds have returnId = null, so they are excluded.
refundSchema.index(
    { returnId: 1 },
    {
        unique: true,
        partialFilterExpression: {
            returnId: { $type: "objectId" },
        },
    }
);

const Refund =
    mongoose.models.Refund ||
    mongoose.model("Refund", refundSchema);

export default Refund;