
import { createSlice } from "@reduxjs/toolkit";

import {
    getAllRefunds,
    getRefundDetails,
    updateRefund
} from "../action/refundAction";

const initialState = {
    refunds: [],
    refundDetails: null,
    selectedRefund: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
};

const refundSlice = createSlice({
    name: "refund",
    initialState,

    reducers: {
        clearRefundError: (state) => {
            state.isError = false;
            state.errorMessage = "";
        },

        clearSelectedRefund: (state) => {
            state.selectedRefund = null;
        },

        clearRefundDetails: (state) => {
            state.refundDetails = null;
        },

        resetRefundState: () => initialState,
    },

    extraReducers: (builder) => {
        

            // GET ALL REFUNDS - PENDING
            builder.addCase(getAllRefunds.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.errorMessage = "";
            })

            // GET ALL REFUNDS - SUCCESS
            builder.addCase(getAllRefunds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.errorMessage = "";
                state.refunds = action.payload || [];
            })

            // GET ALL REFUNDS - ERROR
            builder.addCase(getAllRefunds.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.errorMessage =
                    action.payload || "Failed to fetch refunds.";
            })

            // GET REFUND DETAILS - PENDING
            builder.addCase(getRefundDetails.pending, (state) => {
                state.isLoading = true;
                state.isSuccess = false;
                state.isError = false;
                state.errorMessage = "";
                state.refundDetails = null;
            })

            // GET REFUND DETAILS - SUCCESS
            builder.addCase(getRefundDetails.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.errorMessage = "";
                state.refundDetails = action.payload;
            })

            // GET REFUND DETAILS - ERROR
            builder.addCase(getRefundDetails.rejected, (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.errorMessage =
                    action.payload || "Unable to load refund details.";
            });
            
            builder.addCase(updateRefund.pending, (state) => {
                state.updateLoading = true;
                state.updateSuccess = false;
                state.updateError = false;
                state.updateMessage = "";
            })
        builder.addCase(updateRefund.fulfilled, (state, action) => {
            state.updateLoading = false;
            state.updateSuccess = true;
            state.updateError = false;
            state.updateMessage = "Refund updated successfully.";

            // Update the selected refund details
            state.refundDetails = action.payload;

            // Update the matching refund in the list
            const updatedRefund = action.payload;

            if (updatedRefund?._id) {
                state.refunds = state.refunds.map((refund) =>
                    String(refund._id) === String(updatedRefund._id)
                        ? updatedRefund
                        : refund
                );
            }
        })
        builder.addCase(updateRefund.rejected, (state, action) => {
            state.updateLoading = false;
            state.updateSuccess = false;
            state.updateError = true;
            state.updateMessage =
                action.payload || "Failed to update refund.";
        });
            
    },
});

export const {
    clearRefundError,
    clearSelectedRefund,
    clearRefundDetails,
    resetRefundState,
} = refundSlice.actions;

export default refundSlice.reducer;
