import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        profileName: {
            type: String,
            default: "",
        },

        email: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },

        phoneNumber: {
            type: String,
            default: "",
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            default: "Other",
        },

        dateOfBirth: {
            type: String,
            default: "",
        },

        address: {
            type: String,
            default: "",
        },

        city: {
            type: String,
            default: "",
        },

        state: {
            type: String,
            default: "",
        },

        country: {
            type: String,
            default: "",
        },

        pincode: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        isBlocked: {
            type: Boolean,
            default: false,
        },

        // NEW
        lastLogin: {
            type: Date,
            default: null,
        },

        // NEW
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
  );

export default mongoose.models.User || mongoose.model('User', userSchema);