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

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        loading: null,
        error: null,
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
            });
    }
})

export const { logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;

