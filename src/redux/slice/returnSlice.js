
import { createSlice } from "@reduxjs/toolkit";
import {
    createReturnRequest,
    getAllReturnRequest,
    getReturnRequest,
    updateReturnRequest,
} from "../action/returnAction";
const initialState = {
    returnRequest: null,
    returnRequests: [],
    selectedReturnRequest: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    errorMessage: "",
};


const returnSlice = createSlice({
    name: "return",
    initialState,

    reducers: {
        resetReturnState: (state) => {
            state.returnRequest = null;
            state.selectedReturnRequest = null;
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
        },

    },

    extraReducers: (builder) => {
        builder.addCase(createReturnRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
        })
        builder.addCase(createReturnRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.returnRequest = action.payload?.data ?? null;

            // Newly created request ko list mein bhi add karo
            if (action.payload?.data) {
                state.returnRequests = [
                    action.payload.data,
                    ...state.returnRequests,
                ];
            }
        })
        builder.addCase(createReturnRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.errorMessage =
                action.payload || "Failed to create return request.";
        })

        builder.addCase(getAllReturnRequest.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.errorMessage = "";
        })
        builder.addCase(getAllReturnRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.returnRequests = action.payload;
            state.isError = false;
            state.errorMessage = "";
        })
        builder.addCase(getAllReturnRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.errorMessage =
                action.payload || "Failed to fetch return requests.";
        });

        // GET SINGLE RETURN REQUEST
        builder.addCase(getReturnRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
            state.selectedReturnRequest = null;
        })

        builder.addCase(getReturnRequest.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isSuccess = true;
            state.isError = false;
            state.errorMessage = "";
            state.selectedReturnRequest = action.payload;
        })

        builder.addCase(getReturnRequest.rejected, (state, action) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = true;
            state.errorMessage =
                action.payload || "Failed to fetch return request details.";
            state.selectedReturnRequest = null;
        });


        // UPDATE RETURN REQUEST - ADMIN
        builder.addCase(updateReturnRequest.pending, (state) => {
            state.isLoading = true;
            state.isSuccess = false;
            state.isError = false;
            state.errorMessage = "";
        });

        builder.addCase(
            updateReturnRequest.fulfilled,
            (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.errorMessage = "";

                const updatedReturn = action.payload;

                if (!updatedReturn) return;

                state.returnRequest = updatedReturn;
                state.selectedReturnRequest = updatedReturn;

                // Update the existing item in the list
                state.returnRequests = state.returnRequests.map(
                    (item) =>
                        String(item._id) === String(updatedReturn._id)
                            ? { ...item, ...updatedReturn }
                            : item
                );
            }
        );

        builder.addCase(
            updateReturnRequest.rejected,
            (state, action) => {
                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;
                state.errorMessage =
                    action.payload ||
                    "Failed to update return request.";
            }
        );





    },
});

export const {
    resetReturnState,

} = returnSlice.actions;

export default returnSlice.reducer;
