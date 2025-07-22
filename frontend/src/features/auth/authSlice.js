import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (userData, { rejectWithValue }) => {
    try {
      console.log("login wurde gesendet", userData);
      const response = await axios.post(
        "http://localhost:8800/api/login",
        userData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue({
        message:
          error?.response?.data?.message ||
          "Falsche Zugangsdaten oder Serverfehler",
      });
    }
  }
);

export const requestReset = createAsyncThunk(
  "auth/requestReset",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8800/api/request-reset`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    } catch (err) {
      console.error("API Error:", err);
      return rejectWithValue(err.response?.data || "Etwas ist schiefgelaufen");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `http://localhost:8800/api/reset-password`,
        userData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return res.data;
    } catch (err) {
      console.error("API Error:", err);
      return rejectWithValue(err.response?.data || "Etwas ist schiefgelaufen");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: true,
    token: null,
    loading: null,
    error: null,
    message: null,
  },
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setAuthFromStorage: (state) => {},
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log("Login erfolgreich:", action.payload);
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.user = null; // ← wichtig!
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : action.payload?.message || "Unbekannter Fehler";
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
      });
  },
});

export const { setUser, logout, setAuthFromStorage } = authSlice.actions;
export default authSlice.reducer;
