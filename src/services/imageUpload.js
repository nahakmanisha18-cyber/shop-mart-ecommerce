"use client";
import axios from "axios";

export const imageUpload = async (data) => {
    try {
        const fileData = new FormData();

        fileData.append("file", data);
        fileData.append("upload_preset", "user_profile");

        const res = await axios.post(
            "https://api.cloudinary.com/v1_1/dybvgkfbn/image/upload",
            fileData
        );

        console.log("Cloudinary Response:", res.data);

        return res.data.secure_url;

    } catch (error) {
        console.log("Upload Error:", error.response?.data || error);
        return "";
    }
};