import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const signUp = createAsyncThunk("auth/signUp", async (data, { rejectWithValue }) => {
      try {
         const res = await axios.post("/api/auth/register", data);

         return res.data.user;
      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);


export const logIn = createAsyncThunk(
   "auth/logIn",
   async (data, { rejectWithValue }) => {
      try {
         const res = await axios.post("/api/auth/login", data);
         console.log("Login Response :", res.data);
         return res.data;
      } catch (error) {
       
         return rejectWithValue(error.response.data);
      }
   }
);

export const logout = createAsyncThunk(
   "auth/logout",
   async (_, { rejectWithValue }) => {
      try {

         const res = await axios.post("/api/auth/logout");
         localStorage.removeItem("token");
         localStorage.removeItem("user");

         return res.data;

      } catch (error) {
         return rejectWithValue(error.response.data);
      }
   }
);