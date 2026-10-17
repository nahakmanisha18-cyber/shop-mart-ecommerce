import { createSlice } from "@reduxjs/toolkit";

import {
    addWishlist,
    getWishlist,
    removeWishlist,
} from "../action/wishlistAction";


const initialState = {
    wishlist: null,

    isLoading: false,

    isError: null,

    isSuccess: false,
};


const wishlistSlice = createSlice({

    name: "wishlist",

    initialState,

    reducers: {

        clearWishlistError: (state) => {
            state.isError = null;
        },

        clearWishlistSuccess: (state) => {
            state.isSuccess = false;
        },

    },


    extraReducers: (builder) => {

        // ADD WISHLIST - PENDING
        builder.addCase(
            addWishlist.pending,
            (state) => {

                state.isLoading = true;

                state.isError = null;

                state.isSuccess = false;
            }
        );

        builder.addCase(
            addWishlist.fulfilled,
            (state, action) => {

                state.isLoading = false;

                state.isSuccess = true;

                state.isError = null;

                state.wishlist =
                    action.payload.wishlist;
            }
        );

        builder.addCase(
            addWishlist.rejected,
            (state, action) => {

                state.isLoading = false;

                state.isSuccess = false;

                state.isError =
                    action.payload?.message ||
                    "Failed to add product to wishlist";
            }
        );

        // ========================================
        // GET WISHLIST - PENDING
        // ========================================

        builder.addCase(
            getWishlist.pending,
            (state) => {
                state.isLoading = true;
                state.isError = null;
                state.isSuccess = false;
            }
        );


        // ========================================
        // GET WISHLIST - FULFILLED
        // ========================================

        builder.addCase(
            getWishlist.fulfilled,
            (state, action) => {
                state.isLoading = false;
                state.isError = null;
                state.isSuccess = true;

                state.wishlist =
                    action.payload.wishlist;
            }
        );


        // ========================================
        // GET WISHLIST - REJECTED
        // ========================================

        builder.addCase(
            getWishlist.rejected,
            (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;

                state.isError =
                    action.payload?.message ||
                    "Failed to fetch wishlist";
            }
        );


        // REMOVE WISHLIST 
        builder.addCase(
            removeWishlist.pending,
            (state) => {

                state.isLoading = true;

                state.isError = null;

                state.isSuccess = false;
            }
        );


        builder.addCase(
            removeWishlist.fulfilled,
            (state, action) => {

                state.isLoading = false;

                state.isSuccess = true;

                state.isError = null;

                state.wishlist =
                    action.payload.wishlist;
            }
        );

        builder.addCase(
            removeWishlist.rejected,
            (state, action) => {

                state.isLoading = false;

                state.isSuccess = false;

                state.isError =
                    action.payload?.message ||
                    "Failed to remove product from wishlist";
            }
        );

    },

});


export const {
    clearWishlistError,
    clearWishlistSuccess,
} = wishlistSlice.actions;


export default wishlistSlice.reducer;