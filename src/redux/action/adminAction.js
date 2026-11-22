
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const getDashboardData = createAsyncThunk(
    "admin/getDashboardData",

    async (selectedDate, { rejectWithValue }) => {
        try {
            const token =
                sessionStorage.getItem("TOKEN");

            if (!token) {
                return rejectWithValue({
                    success: false,
                    message: "Please login first",
                });
            }

            const response = await axios.get(
                "/api/admin/dashboard",
                {
                    params: selectedDate
                        ? { date: selectedDate }
                        : undefined,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    success: false,
                    message:
                        "Failed to get dashboard data",
                }
            );
        }
    }
);