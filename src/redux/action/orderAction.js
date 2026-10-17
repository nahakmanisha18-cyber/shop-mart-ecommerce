import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//CREATE ORDRT
export const createOrder = createAsyncThunk(
    "order/createOrder",

    async (orderData, { rejectWithValue }) => {

        try {

            const token = sessionStorage.getItem("TOKEN");

            // console.log(
            //     "ORDER TOKEN:",
            //     token
            // );

            if (!token) {

                return rejectWithValue({
                    success: false,
                    message: "Please login first",
                });

            }
            const response = await axios.post(
                "/api/order/create",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            console.log(
                "CREATE ORDER RESPONSE:",
                response.data
            );


            return response.data;


        } catch (error) {

            console.error(
                "CREATE ORDER ERROR:",
                error.response?.data || error
            );

            return rejectWithValue(
                error.response?.data || {
                    success: false,
                    message: "Failed to create order",
                }
            );

        }

    }
);


//GET ORDER
export const getOrders = createAsyncThunk(
    "order/getOrders",

    async (_, { rejectWithValue }) => {

        try {

            const token =
                sessionStorage.getItem("TOKEN");

            console.log(
                "GET ORDERS TOKEN:",
                token
            );

            if (!token) {

                return rejectWithValue({
                    success: false,
                    message: "Please login first",
                });
            }
            const response = await axios.get(
                "/api/order/getOrders",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "GET ORDERS RESPONSE:",
                response.data
            );

            return response.data;

        } catch (error) {

            console.error(
                "GET ORDERS ACTION ERROR:",
                error.response?.data || error
            );

            return rejectWithValue(
                error.response?.data || {
                    success: false,
                    message: "Failed to get orders",
                }
            );
        }
    }
);


// GET SINGLE ORDER
export const getOrder = createAsyncThunk(
    "order/getOrder",

    async (
        orderId,
        { rejectWithValue }
    ) => {

        try {

            const token =
                sessionStorage.getItem("TOKEN");

            if (!token) {

                return rejectWithValue({
                    success: false,
                    message: "Please login first",
                });

            }

            const response =
                await axios.get(
                    `/api/order/getOrder/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

            return response.data;

        } catch (error) {

            console.error(
                "GET ORDER ERROR:",
                error.response?.data || error
            );

            return rejectWithValue(
                error.response?.data || {
                    success: false,
                    message:
                        "Failed to get order",
                }
            );
        }
    }
);

// CANCEL ORDER

export const cancelOrder = createAsyncThunk(
    "order/cancelOrder",

    async (orderId, { rejectWithValue }) => {

        try {

            const token = sessionStorage.getItem("TOKEN");

            console.log("CANCEL ORDER TOKEN:", token);

            // Login check
            if (!token) {

                return rejectWithValue({
                    success: false,
                    message: "Please login first",
                });

            }

            const response = await axios.patch(
                `/api/order/cancel/${orderId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(
                "CANCEL ORDER RESPONSE:",
                response.data
            );

            return response.data;

        } catch (error) {
            console.error("CANCEL ORDER ERROR:", {
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
                url: error.config?.url,
                method: error.config?.method,
            });

            return rejectWithValue(
                error.response?.data || {
                    success: false,
                    message: error.message || "Failed to cancel order",
                }
            );
        }
    }
);


export const updateOrder = createAsyncThunk(
    "order/updateOrder",

    async (
        {
            orderId,
            paymentMethod,
            paymentStatus,
            orderStatus,
        },
        { rejectWithValue }
    ) => {

        try {

            const token =
                typeof window !== "undefined"
                    ? sessionStorage.getItem("TOKEN")
                    : null;


            if (!token) {

                return rejectWithValue(
                    "Please login first"
                );

            }


            const response = await axios.put(
                `/api/order/updateOrder/${orderId}`,

                {
                    paymentMethod,
                    paymentStatus,
                    orderStatus,
                },

                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );


            return response.data;


        } catch (error) {

            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to update order"
            );

        }

    }
);


// Delete cancelled order - Admin only
export const deleteOrder = createAsyncThunk(
    "order/deleteOrder",

    async (orderId, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("TOKEN");

            const response = await axios.delete(
                `/api/order/delete/${orderId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                "Failed to delete order"
            );
        }
    }
);