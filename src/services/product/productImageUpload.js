"use client";

import axios from "axios";

export const productImageUpload = async (files) => {
    try {
        const uploadedImages = [];

        for (const file of files) {
            const fileData = new FormData();

            fileData.append("file", file);
            fileData.append("upload_preset", "product_images");

            const res = await axios.post(
                "https://api.cloudinary.com/v1_1/dybvgkfbn/image/upload",
                fileData
            );

            uploadedImages.push(res.data.secure_url);
        }

        console.log("Uploaded Product Images:", uploadedImages);

        return uploadedImages;

    } catch (error) {
        console.log(
            "Product Image Upload Error:",
            error.response?.data || error
        );

        return [];
    }
};