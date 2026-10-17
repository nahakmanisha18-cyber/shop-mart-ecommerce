import { createSlice } from "@reduxjs/toolkit";
import { logIn, signUp, logout } from "../action/authAction";
import { updateProfile } from "../action/userAction";

export const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isLoading: false,
        isError: null,
        isCreate: false,
        isAuthenticated: false,
        isAuthChecked: false,
    },
    reducers: {
        getProfile: (state) => {

            const user = sessionStorage.getItem("USER");
            const token = sessionStorage.getItem("TOKEN");

            if (user && token) {
                state.user = JSON.parse(user);
                state.isAuthenticated = true;
            } else {
                state.user = null;
                state.isAuthenticated = false;
            }

            state.isAuthChecked = true;
        },
        clearError: (state) => {
            state.isError = null;
        }
    },

    extraReducers: (builder) => {

        builder.addCase(signUp.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        });

        builder.addCase(signUp.fulfilled, (state) => {
            state.isLoading = false;
        });

        builder.addCase(signUp.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload?.message || null;
        });

        builder.addCase(logIn.pending, (state) => {
            state.isLoading = true;
            state.isError = null;
        });

        builder.addCase(logIn.fulfilled, (state, action) => {
            state.isLoading = false;

            state.user = action.payload.user;
            state.isAuthenticated = true;

            sessionStorage.setItem(
                "USER",
                JSON.stringify(action.payload.user)
            );

            sessionStorage.setItem(
                "TOKEN",
                action.payload.token
            );
        });

        builder.addCase(logIn.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload?.message || null;
        });

        builder.addCase(logout.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(logout.fulfilled, (state) => {
            state.isLoading = false;

            state.user = null;
            state.isAuthenticated = false;

            sessionStorage.removeItem("USER");
            sessionStorage.removeItem("TOKEN");
        });

        builder.addCase(logout.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = action.payload?.message || "Logout failed";
        });


        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload.user;
            state.isLoading = false;

            sessionStorage.setItem(
                "USER",
                JSON.stringify(action.payload.user)
            );
        });

    }
})
export const { getProfile, clearError } = authSlice.actions;
export default authSlice.reducer
