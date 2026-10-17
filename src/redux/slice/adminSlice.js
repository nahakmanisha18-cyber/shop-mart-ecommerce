import { createSlice } from "@reduxjs/toolkit";
// import { getUserCount } from "../action/adminAction";
import {
    // getUserCount,
    getDashboardData
} from "../action/adminAction";


const initialState = {
    userCount: 0,

    dashboard: {
        stats: {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
        },

        orderStatus: {
            pending: 0,
            confirmed: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        },

        recentOrders: [],
        topProducts: [],
        lowStockProducts: [],
        salesOverview: [],
    },

    isLoading: false,
    isError: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,

    reducers: {},

    extraReducers: (builder) => {

        builder.addCase(
            getDashboardData.pending,
            (state) => {
                state.isLoading = true;
                state.isError = null;
            }
        );

        builder.addCase(
            getDashboardData.fulfilled,
            (state, action) => {
                state.isLoading = false;
                state.isError = null;

                state.dashboard = {
                    stats:
                        action.payload.stats ||
                        state.dashboard.stats,

                    orderStatus:
                        action.payload.orderStatus ||
                        state.dashboard.orderStatus,

                    recentOrders:
                        action.payload.recentOrders || [],

                    topProducts:
                        action.payload.topProducts || [],

                    lowStockProducts:
                        action.payload.lowStockProducts || [],

                    salesOverview:
                        action.payload.salesOverview || [],
                };
            }
        );

        builder.addCase(
            getDashboardData.rejected,
            (state, action) => {
                state.isLoading = false;

                state.isError =
                    action.payload?.message ||
                    "Failed to get dashboard data";
            }
        );
    },
});

export default adminSlice.reducer;