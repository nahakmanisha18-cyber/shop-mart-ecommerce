import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await axios.put(
                "/api/user/updateProfile",
                userData
            );

            return data;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

export const getUserProfile = createAsyncThunk(
    "user/getProfile",
    async (email, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `/api/user/getProfile?email=${email}`
            );

            return data.user;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );
        }
    }
);

export const getAllUsers = createAsyncThunk(
    "user/getAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token =
                (typeof window !== "undefined" &&
                    (sessionStorage.getItem("TOKEN") ||
                        localStorage.getItem("TOKEN"))) ||
                "";

            const { data } = await axios.get("/api/user/all", {
                headers: {
                    Authorization: `Bearer ${ token } `,
                },
            });

            return data.users || [];
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                    "Failed to fetch users"
            );
        }
    }
);

export const getUserById = createAsyncThunk(
    "user/getUserById",
    async (id, { rejectWithValue }) => {
        try {
            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token") ||
                sessionStorage.getItem("TOKEN");

            const { data } = await axios.get(
                `/api/user/getUser/${id}`,
                {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {},
                }
            );

            return data.user;
        } catch (error) {
            return rejectWithValue(
                error?.response?.data?.message ||
                "Failed to fetch user details"
            );
        }
    }
);