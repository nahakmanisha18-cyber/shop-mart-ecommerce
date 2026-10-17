import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createReturnRequest = createAsyncThunk(
    "return/createReturnRequest",
    async (payload, { rejectWithValue }) => {
        try {
            const token =
                sessionStorage.getItem("TOKEN") ||
                localStorage.getItem("TOKEN");

            const response = await axios.post(
                "/api/return/create",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${ token } `,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.log("RETURN API ERROR:", error.response?.data);
            console.log("RETURN PAYLOAD:", payload);

            return rejectWithValue(
                error.response?.data?.message || "Failed to create return request."
            );
          }
    }
);


export const getAllReturnRequest = createAsyncThunk(
    "return/getAllReturnRequest",
    async (_, { rejectWithValue }) => {
        try {
            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            const response = await axios.get("/api/return/all", {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : {},
            });

            const result = response.data;

            if (!result.success) {
                return rejectWithValue(
                    result.message || "Failed to fetch return requests."
                );
            }

            return result.data || result.returnRequests || [];
        } catch (error) {
            console.error(
                "GET ALL RETURN REQUESTS ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Something went wrong."
            );
        }
    }
);

export const getReturnRequest = createAsyncThunk(
    "return/getReturnRequest",
    async (returnId, { rejectWithValue }) => {
        try {
            if (!returnId) {
                return rejectWithValue(
                    "Return request ID is required."
                );
            }

            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            const response = await axios.get(
                `/api/return/details/${encodeURIComponent(returnId)}`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            const result = response.data;

            if (!result.success) {
                return rejectWithValue(
                    result.message ||
                    "Failed to fetch return request details."
                );
            }

            return result.data || result.returnRequest || null;
        } catch (error) {
            console.error(
                "GET RETURN REQUEST DETAILS ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to fetch return request details."
            );
        }
    }
);


export const updateReturnRequest = createAsyncThunk(
    "return/updateReturnRequest",
    async ({ returnId, updateData }, { rejectWithValue }) => {
        try {
            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN") ||
                        localStorage.getItem("token"))) ||
                "";

            if (!returnId) {
                return rejectWithValue(
                    "Return request ID is missing."
                );
            }

            if (!token) {
                return rejectWithValue(
                    "Authentication token not found. Please login again."
                );
            }

            const response = await axios.put(
                `/api/return/edit/${encodeURIComponent(returnId)}`,
                updateData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log(
                "UPDATE RETURN API RESPONSE:",
                response.data
            );

            if (!response.data?.success) {
                return rejectWithValue(
                    response.data?.message ||
                    "Return request update failed."
                );
            }

            return (
                response.data.returnRequest ||
                response.data.data ||
                null
            );
        } catch (error) {
            console.error(
                "UPDATE RETURN API ERROR:",
                error.response?.status,
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Failed to update return request."
            );
        }
    }
);

