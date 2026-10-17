import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// GET ALL REFUNDS
export const getAllRefunds = createAsyncThunk(
    "refund/getAllRefunds",
    async (_, { rejectWithValue }) => {
        try {
            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            if (!token) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await axios.get("/api/refund/all", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.data?.success) {
                return rejectWithValue(
                    response.data?.message || "Failed to fetch refunds."
                );
            }

            return response.data.refunds || [];
        } catch (error) {
            console.error(
                "GET ALL REFUNDS ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch refunds."
            );
        }
    }
);



export const getRefundDetails = createAsyncThunk(
    "refund/getRefundDetails",
    async (refundId, { rejectWithValue }) => {
        try {
            if (!refundId) {
                return rejectWithValue("Refund ID is required.");
            }

            // Use the same token lookup as getAllRefunds
            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            if (!token) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await axios.get(
                `/api/refund/details/${refundId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.data?.success) {
                return rejectWithValue(
                    response.data?.message ||
                    "Failed to fetch refund details."
                );
            }

            return response.data.refund;
        } catch (error) {
            console.error(
                "GET REFUND DETAILS ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch refund details."
            );
        }
    }
);


export const updateRefund = createAsyncThunk(
    "refund/updateRefund",
    async ({ refundId, updateData }, { rejectWithValue }) => {
        try {
            if (!refundId) {
                return rejectWithValue("Refund ID is required.");
            }

            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            if (!token) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await axios.put(
                `/api/refund/update/${refundId}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.data?.success) {
                return rejectWithValue(
                    response.data?.message || "Failed to update refund."
                );
            }

            return response.data.refund;
        } catch (error) {
            console.error(
                "UPDATE REFUND ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update refund."
            );
        }
    }
);
