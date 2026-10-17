import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


// ========================================
// ADD WISHLIST
// ========================================

export const addWishlist = createAsyncThunk(
    "wishlist/addWishlist",

    async (productId, { rejectWithValue }) => {

        try {

            const token =
                sessionStorage.getItem("TOKEN");

            if (!token) {
                return rejectWithValue({
                    message: "Please login first",
                });
            }

            const { data } = await axios.post(
                "/api/wishlist/addWishlist",
                {
                    productId,
                },
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            return data;

        } catch (error) {

            console.error(
                "ADD WISHLIST ERROR:",
                error.response?.data ||
                error.message
            );

            return rejectWithValue(
                error.response?.data || {
                    message:
                        "Failed to add product to wishlist",
                }
            );
        }
    }
);


// ========================================
// GET WISHLIST
// ========================================

export const getWishlist = createAsyncThunk(
    "wishlist/getWishlist",

    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("TOKEN");

            if (!token) {
                return rejectWithValue({
                    message: "Please login first",
                });
            }

            const { data } = await axios.get(
                "/api/wishlist/getWishlist",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;

        } catch (error) {
            console.error(
                "GET WISHLIST ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch wishlist",
                }
            );
        }
    }
);

// ========================================
// REMOVE WISHLIST
// ========================================
export const removeWishlist = createAsyncThunk(
    "wishlist/removeWishlist",
    async (productId, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("TOKEN");

            if (!token) {
                return rejectWithValue("Please login first");
            }

            const response = await axios.delete(
                "/api/wishlist/removeWishlist",
                {
                    data: {
                        productId,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(
                "REMOVE WISHLIST ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to remove wishlist"
            );
        }
    }
);