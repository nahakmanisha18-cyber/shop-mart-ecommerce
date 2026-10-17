import { createSlice } from "@reduxjs/toolkit";

import { createPaymentOrder, verifyPayment, getPayments, getPaymentDetails } from "../action/paymentAction";


const initialState = {
    order: null,
    payment: null,
    isLoading: false,
    isError: null,
    isSuccess: false,
    payments: [],
    paymentDetails: null,
};



const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {

        clearPaymentState: (state) => {

            state.order = null;
            state.payment = null;
            state.isLoading = false;
            state.isError = null;
            state.isSuccess = false;

        },

    },

extraReducers: (builder) => {

    // CREATE PAYMENT ORDER
    builder
        .addCase(createPaymentOrder.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
            state.isSuccess = false;
        })
        .addCase(createPaymentOrder.fulfilled, (state, action) => {
            state.isLoading = false;
            state.order = action.payload.order;
            state.isSuccess = action.payload.success;
        })
        .addCase(createPaymentOrder.rejected, (state, action) => {
            state.isLoading = false;
            state.isError =
                action.payload?.message || "Order creation failed";
            state.isSuccess = false;
        })

        // VERIFY PAYMENT
        .addCase(verifyPayment.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        })
        .addCase(verifyPayment.fulfilled, (state, action) => {
            state.isLoading = false;
            state.payment = action.payload;
            state.isSuccess = action.payload.success;
        })
        .addCase(verifyPayment.rejected, (state, action) => {
            state.isLoading = false;
            state.isError =
                action.payload?.message || "Payment verification failed";
            state.isSuccess = false;
        })

        // GET ALL PAYMENTS
        .addCase(getPayments.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        })
        .addCase(getPayments.fulfilled, (state, action) => {
            state.isLoading = false;
            state.payments = action.payload.payments || [];
        })
        .addCase(getPayments.rejected, (state, action) => {
            state.isLoading = false;
            state.isError =
                action.payload?.message || "Failed to fetch payments";
        })

        // GET PAYMENT DETAILS
        .addCase(getPaymentDetails.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
            state.paymentDetails = null;
        })
        .addCase(getPaymentDetails.fulfilled, (state, action) => {
            state.isLoading = false;
            state.paymentDetails = action.payload;
        })
        .addCase(getPaymentDetails.rejected, (state, action) => {
            state.isLoading = false;
            state.isError =
                action.payload?.message ||
                action.payload ||
                "Failed to fetch payment details";
        });
},


});


export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;