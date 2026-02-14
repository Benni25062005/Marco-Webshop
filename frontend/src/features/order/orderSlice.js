import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.BACKEND_URL}/api/orders`,
        orderData,
      );
      return response.data;
    } catch (error) {
      console.error("Fehler bei erstellung", error);
      return rejectWithValue(
        error.response?.data || { message: error.message || "Network error" },
      );
    }
  },
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (idUser, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${process.env.BACKEND_URL}/api/orders/${idUser}`,
      );
      return response.data;
    } catch (error) {
      console.error("→ Fehler im Thunk:", error);
      return rejectWithValue(error.response?.data || "Fehler beim Abrufen");
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    lastCreatedOrder: null,
    loading: false,
    error: null,
    orderCompleted: false,
  },
  reducers: {
    setOrderCompleted(state, action) {
      state.orderCompleted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastCreatedOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Fehler beim Laden";
      });
  },
});

export const { setOrderCompleted } = orderSlice.actions;
export default orderSlice.reducer;
