import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
    "cart/addToCart",

    async (
        { productId, quantity = 1 },
        { rejectWithValue }
    ) => {

        try {
            const token = sessionStorage.getItem("TOKEN");
            console.log("TOKEN:", token);

            if (!token) {
                console.log("TOKEN NOT FOUND");
                return rejectWithValue({
                    message: "Please login first",
                });
            }

            const { data } = await axios.post("/api/cart/addCart",
                { productId, quantity},
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            console.log("API RESPONSE:",data);
            return data;

        } catch (error) {

            console.log(
                "AXIOS ERROR:",
                error.response?.data ||
                error.message
            );

            return rejectWithValue(
                error.response?.data || {
                    message:
                        "Failed to add product to cart",
                }

            );
        }
    }
);

// GET CART
export const getCart = createAsyncThunk(

    "cart/getCart",

    async (_, { rejectWithValue }) => {

        try {

            console.log("GET CART THUNK RUNNING");
            const token =
                sessionStorage.getItem("TOKEN");

            console.log(
                "CART TOKEN:",
                token
            );

            if (!token) {

                return rejectWithValue({
                    message: "Please login first",
                });

            }

            const { data } = await axios.get(
                "/api/cart/getCart",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );
            console.log(
                "GET CART RESPONSE:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "GET CART ERROR:",
                error.response?.data ||
                error.message
            );


            return rejectWithValue(
                error.response?.data || {
                    message:
                        "Failed to get cart",
                }
            );

        }

    }

);

// UPDATE CART
export const updateCart = createAsyncThunk(

    "cart/updateCart",

    async (
        { productId, quantity },
        { rejectWithValue }
    ) => {

        try {

            // console.log(
            //     "UPDATE CART THUNK RUNNING"
            // );

            // console.log(
            //     "PRODUCT ID:",
            //     productId
            // );

            // console.log(
            //     "QUANTITY:",
            //     quantity
            // );

            const token = sessionStorage.getItem("TOKEN");


            if (!token) {

                return rejectWithValue({
                    message: "Please login first",
                });

            }

            const { data } =
                await axios.put(
                    "/api/cart/updateCart",
                    {
                        productId,
                        quantity,
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

            // console.log(
            //     "UPDATE CART RESPONSE:",
            //     data
            // );
            return data;


        } catch (error) {

            console.error(
                "UPDATE CART ERROR:",
                error.response?.data ||
                error.message
            );

            return rejectWithValue(
                error.response?.data || {
                    message:
                        "Failed to update cart",
                }
            );

        }

    }

);

// REMOVE FROM CART

export const deleteCart = createAsyncThunk(

    "cart/deleteCart",

    async (
        productId,
        { rejectWithValue }
    ) => {

        try {

            // console.log(
            //     "REMOVE CART THUNK RUNNING"
            // );

            // console.log(
            //     "PRODUCT ID:",
            //     productId
            // );

            const token = sessionStorage.getItem("TOKEN");


            if (!token) {

                return rejectWithValue({
                    message: "Please login first",
                });

            }

            const { data } =
                await axios.delete(
                    "/api/cart/deleteCart",
                    {
                        data: {
                            productId,
                        },

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            console.log(
                "REMOVE CART RESPONSE:",
                data
            );


            return data;


        } catch (error) {

            console.error(
                "REMOVE CART ERROR:",
                error.response?.data ||
                error.message
            );


            return rejectWithValue(
                error.response?.data || {
                    message:
                        "Failed to remove product",
                }
            );

        }

    }

);

//CLEARE CART
export const clearCart = createAsyncThunk(
    "cart/clearCart",
    async (_, { rejectWithValue }) => {
        try {
            const token = sessionStorage.getItem("TOKEN");

            const { data } = await axios.delete(
                "/api/cart/clearCart",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;

        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Clear cart failed",
                }
            );
        }
    }
);