import { createSlice } from "@reduxjs/toolkit";

import { addToCart, clearCart, deleteCart, getCart, updateCart } from "../action/cartAction";


const initialState = {
    cart: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
};


const cartSlice = createSlice({

    name: "cart",

    initialState,

    reducers: {

        clearCartError: (state) => {
            state.isError = null;
        },
        clearCartSuccess: (state) => {
            state.isSuccess = false;
        },

    },


    extraReducers: (builder) => {

        // ADD TO CART

        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
            state.isSuccess = false;
        }
        );


        builder.addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = null;
            state.cart = action.payload.cart;
        }
        );


        builder.addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = action.payload?.message || "Failed to add product to cart";
        }
        );

        // GET CART

        builder.addCase(getCart.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        }
        );

        builder.addCase(getCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = null;
            state.cart = action.payload.cart;
        }
        );


        builder.addCase(getCart.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError =
                action.payload?.message ||
                "Failed to get cart";
        }
        );

        // UPDATE CART

        builder.addCase(updateCart.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        }
        );


        builder.addCase(updateCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = null;
            state.cart = action.payload.cart;
        }
        );


        builder.addCase(updateCart.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError =
                action.payload?.message ||
                "Failed to update cart";
        }
        );

        // REMOVE FROM CART

        builder.addCase(deleteCart.pending, (state) => {
            state.isLoading = true;
            state.isError = null
        }
        );


        builder.addCase(deleteCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = null;
            state.cart =
                action.payload.cart;
        }
        );


        builder.addCase(deleteCart.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError =
                action.payload?.message ||
                "Failed to remove product";
        }
        );

        // CLEAR CART

        builder.addCase(clearCart.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        }
        );

        builder.addCase(clearCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = null;
            state.cart = action.payload.cart;
        }
        );

        builder.addCase(clearCart.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError =
                action.payload?.message ||
                "Failed to clear cart";
        }
        );

    },

});


export const {  clearCartError,  clearCartSuccess} = cartSlice.actions;
export default cartSlice.reducer;