import {
    createSlice,
} from "@reduxjs/toolkit";

import {
    createOrder, getOrders, getOrder,
    cancelOrder,
    updateOrder,
    deleteOrder
} from "../action/orderAction";


const initialState = {
    orders: [],
    selectedOrder: null,
    isLoading: false,
    isError: false,
    errorMessage: "",
    isSuccess: false,
};


const orderSlice =
    createSlice({

        name: "order",

        initialState,

        reducers: {

            clearOrderState: (state) => {
                state.isLoading = false;
                state.isError = false;
                state.errorMessage = "";
                state.isSuccess = false;
            },

            clearSelectedOrder: (state) => {
                state.selectedOrder = null;
            },
        },

        extraReducers: (builder) => {

            // CREATE ORDER

            builder.addCase(createOrder.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
                state.isSuccess = false;
            }
            )

            builder.addCase(createOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.selectedOrder =
                    action.payload.order;
                if (
                    action.payload.order
                ) {

                    state.orders.unshift(
                        action.payload.order
                    );
                }
            }
            )

            builder.addCase(createOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.isSuccess = false;
                state.errorMessage =
                    action.payload
                        ?.message ||
                    "Failed to create order";
            }
            );


            // GET ORDERS

            builder.addCase(getOrders.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
            }
            )

            builder.addCase(getOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.orders =
                    action.payload.orders ||
                    [];
            }
            )

            builder.addCase(getOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage =
                    action.payload
                        ?.message ||
                    "Failed to get orders";
            }
            );

            // GET SINGLE ORDER

            builder.addCase(getOrder.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = "";
            }
            )

            builder.addCase(getOrder.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isError = false;
                state.selectedOrder =
                    action.payload.order;
            }
            )

            builder.addCase(getOrder.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.selectedOrder = null;
                state.errorMessage =
                    action.payload
                        ?.message ||
                    "Failed to get order";
            }
            );


            // CANCEL ORDER

            builder

                .addCase(
                    cancelOrder.pending,
                    (state) => {

                        state.isLoading = true;

                        state.isError = false;

                        state.errorMessage = "";
                    }
                )

                builder.addCase(
                    cancelOrder.fulfilled,
                    (state, action) => {

                        state.isLoading = false;

                        state.isSuccess = true;

                        const updatedOrder =
                            action.payload.order;

                        state.selectedOrder =
                            updatedOrder;

                        state.orders =
                            state.orders.map(
                                (order) =>
                                    order._id ===
                                        updatedOrder._id
                                        ? updatedOrder
                                        : order
                            );
                    }
                )

            builder.addCase(
                    cancelOrder.rejected,
                    (state, action) => {

                        state.isLoading = false;

                        state.isError = true;

                        state.errorMessage =
                            action.payload
                                ?.message ||
                            "Failed to cancel order";
                    }
                );


            builder.addCase(updateOrder.pending, (state) => {

                    state.isLoading = true;
                    state.isError = false;
                    state.errorMessage = "";
                    state.isSuccess = false;

                })

                builder.addCase(updateOrder.fulfilled, (state, action) => {

                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;

                state.selectedOrder = action.payload.order;


                // Update order inside orders array
                const updatedOrder = action.payload.order;

                const index = state.orders.findIndex(
                    (order) => order._id === updatedOrder._id
                );


                if (index !== -1) {

                    state.orders[index] = updatedOrder;

                }

            })

            builder.addCase(updateOrder.rejected, (state, action) => {

                state.isLoading = false;
                state.isSuccess = false;
                state.isError = true;

                state.errorMessage =
                    action.payload || "Failed to update order";

                })

                .addCase(deleteOrder.pending, (state) => {
                    state.isLoading = true;
                    state.isError = false;
                    state.errorMessage = "";
                })

                .addCase(deleteOrder.fulfilled, (state, action) => {
                    state.isLoading = false;
                    state.isSuccess = true;

                    const deletedId = action.payload.orderId;

                    // Remove deleted order from orders list
                    state.orders = state.orders.filter(
                        (order) => order._id !== deletedId
                    );

                    // If deleted order was selected
                    if (state.selectedOrder?._id === deletedId) {
                        state.selectedOrder = null;
                    }
                })

                .addCase(deleteOrder.rejected, (state, action) => {
                    state.isLoading = false;
                    state.isError = true;

                    state.errorMessage =
                        action.payload || "Failed to delete order";
                })

        },
    });


export const { clearOrderState, clearSelectedOrder} = orderSlice.actions;


export default orderSlice.reducer;