import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/authSlice";
import userSlice from "./slice/userSlice";
import adminSlice from "./slice/adminSlice";
import productSlice from "./slice/productSlice";
import cartSlice from "./slice/cartSlice";
import paymentSlice from "./slice/paymentSlice";
import orderSlice from "./slice/orderSlice";
import wishlistSlice from "./slice/wishlistSlice";
import refundSlice from "./slice/refundSlice";
import returnSlice from "./slice/returnSlice";

export const store = configureStore({
    reducer: {
        authStore: authSlice,
        userStore: userSlice,
        adminStore: adminSlice,
        productStore: productSlice,
        cartStore: cartSlice,
        paymentStore: paymentSlice,
        orderStore: orderSlice,
        wishlistStore: wishlistSlice,
        refundStore: refundSlice,
        returnStore: returnSlice,

    },
});