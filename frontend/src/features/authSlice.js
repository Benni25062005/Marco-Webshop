import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
    "auth/login",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:8800/api/login", userData);
            localStorage.setItem("token", response.data.token);
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const requestReset = createAsyncThunk(
  "auth/requestReset",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`http://localhost:8800/api/request-reset`, userData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err) {
      console.error("API Error:", err);
      return rejectWithValue(err.response?.data || "Etwas ist schiefgelaufen");
    }
  }
)

export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (userData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`http://localhost:8800/api/reset-password`, userData, {
                headers: { "Content-Type": "application/json" },
            });
            return res.data;
        } catch (err) {
            console.error("API Error:", err);
            return rejectWithValue(err.response?.data ||"Etwas ist schiefgelaufen");
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: null,
        error: null,
        message: null,
        loadingFromStorage: true,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        },
        setAuthFromStorage: (state) => {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            if (token && user) {
                state.token = token;
                state.user = JSON.parse(user);
            }
            state.loadingFromStorage = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
                localStorage.setItem("user", JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })
            .addCase(requestReset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestReset.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message;
            })
            .addCase(requestReset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload.message; 
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload; 
            })  
    }
})

export const { logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;

