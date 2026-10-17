import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        productName: {
            type: String,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        category: {
            type: String,
            trim: true,
        },

        brand: {
            type: String,
            trim: true,
        },

        color: {
            type: String,
            trim: true,
        },

        size: {
            type: String,
            trim: true,
        },

        price: {
            type: Number,
        },

        discountPrice: {
            type: Number,
        },

        sku: {
            type: String,
            unique: true,
            trim: true,
            uppercase: true,
        },

        stock: {
            type: Number,
        },

        images: {
            type: [String],
            default: []
        },

        featured: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;