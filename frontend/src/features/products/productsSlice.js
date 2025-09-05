import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
  selectedItem: null,
  status: null,
};

export const fetchFeuerloescher = createAsyncThunk(
  "products/productsFetch",
  async (kategorie) => {
    try {
      console.log(kategorie);
      const res = await axios.get(
        `${process.env.BACKEND_URL}/produkte?kategorie=${kategorie}`
      );

      if (!res.data || res.data.length === 0) {
        throw new Error("No products found");
      }
      return res.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchFeuerloescherById = createAsyncThunk(
  "products/productsFetchById",
  async ({ idProdukt, kategorie }) => {
    try {
      const res = await axios.get(
        `${process.env.BACKEND_URL}/produkte/${idProdukt}`,
        {
          params: { kategorie: "feuerloescher" },
        }
      );
      return res?.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAll",
  async (__DO_NOT_USE__ActionTypes, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${process.env.BACKEND_URL}/api/products`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Fehler beim laden der Produkte"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchById",
  async ({ idProdukt }, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${process.env.BACKEND_URL}/api/products/${idProdukt}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Produkt nicht gefunden");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearFeuerloescher: (state) => {
      state.items = [];
      state.status = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeuerloescher.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeuerloescher.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(fetchFeuerloescher.rejected, (state, action) => {
        state.status = "failed";
      })

      .addCase(fetchFeuerloescherById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFeuerloescherById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
        state.status = "success";
      })
      .addCase(fetchFeuerloescherById.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = "success";
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedItem = action.payload;
        state.status = "success";
      });
  },
});

export default productsSlice.reducer;
