import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const addProduct = createAsyncThunk(
    "product/addProduct",

    async (productData, { rejectWithValue }) => {
        try {
            const { data } = await axios.post(
                "/api/product/addProduct",
                productData
            );

            return data;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data || "Something went wrong"
            );

        }
    }
);



export const getAllProducts = createAsyncThunk(
    "product/getAllProducts",

    async (productData, { rejectWithValue }) => {

        try {

            const { data } = await axios.get(
                "/api/product/getAllProducts"
            );

            return data;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data || {
                    message: "Something went wrong"
                }
            );
        }
    }
);

export const getProduct = createAsyncThunk(
    "product/getProduct",

    async (productId, { rejectWithValue }) => {
        try {
            const { data } = await axios.get(
                `/api/product/getProduct/${productId}`
            );

            return data;

        } catch (error) {
            return rejectWithValue(
                error?.response?.data || {
                    message: "Something went wrong"
                }
            );
        }
    }
);

export const deleteProduct = createAsyncThunk(
    "product/deleteProducts",

    async (productId, { rejectWithValue }) => {

        try {

            const { data } = await axios.delete(
                `/api/product/deleteProducts/${productId}`
            );

            return data;

        } catch (error) {

            return rejectWithValue(
                error?.response?.data || {
                    message: "Something went wrong"
                }
            );
        }
    }
);

export const updateProduct = createAsyncThunk(
    "product/updateProduct",

    async ({ productId, productData }, { rejectWithValue }) => {

        try {

            console.log("THUNK PRODUCT ID:", productId);
            console.log("THUNK PRODUCT DATA:", productData);

            if (!productId) {
                return rejectWithValue({
                    message: "Product ID is missing",
                });
            }

            const { data } = await axios.put(
                `/api/product/updateProduct/${productId}`,
                productData
            );

            console.log("UPDATE API RESPONSE:", data);

            return data;

        } catch (error) {

            console.log(
                "UPDATE PRODUCT API ERROR:",
                error.response?.data || error.message
            );

            return rejectWithValue(
                error.response?.data || {
                    message: "Failed to update product",
                }
            );

        }

    }
);