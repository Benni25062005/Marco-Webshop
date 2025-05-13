import { createAsyncThunk, createSlice, isRejectedWithValue } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
    "user/register",
    async (userData, { rejectWithValue  }) => {
        try {
            const res = await axios.post("http://localhost:8800/user", userData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            return res.data;
        } catch (error) {
            console.error("API Error:", error);
            return rejectWithValue(error.response?.data || "Etwas ist schiefgelaufen");

        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        status: null,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = "success";
                state.currentUser = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    }
})

export default userSlice.reducer;