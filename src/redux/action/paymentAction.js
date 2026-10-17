import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createPaymentOrder = createAsyncThunk("payment/createPaymentOrder",
    async (amount, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/payment/create-order", { amount });
            return res.data;

        } catch (error) {

            return rejectWithValue(
                error.response?.data || {
                    message: "Order creation failed",
                }
            );
        }
    }
);


export const verifyPayment = createAsyncThunk("payment/verifyPayment",
    async (paymentData, { rejectWithValue }) => {
        try {
            const res = await axios.post("/api/payment/verify", paymentData);
            return res.data;
        } catch (error) {

            return rejectWithValue(
                error.response?.data || {
                    message: "Payment verification failed",
                }
            );
        }
    }
);



export const getPayments = createAsyncThunk(
    "payment/getPayments",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get("/api/payment/getPayment");
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to fetch payments",
                }
            );
        }
    }

);




export const getPaymentDetails = createAsyncThunk(
    "payment/getPaymentDetails",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `/api/payment/details/${encodeURIComponent(id)}`
            );

            if (!response.data.success) {
                return rejectWithValue(
                    response.data.message || "Failed to fetch payment details"
                );
            }

            return response.data.payment;

        } catch (error) {
            console.error(
                "Get Payment Details Error:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch payment details"
            );
        }
    }
);