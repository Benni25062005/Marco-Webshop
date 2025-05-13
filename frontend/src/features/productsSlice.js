import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
    selectedItem:null,
    status: null
}

export const fetchFeuerloescher = createAsyncThunk(
    "products/productsFetch",
    async (kategorie) => {
        try {
          const res = await axios.get(`http://localhost:8800/produkte?kategorie=${kategorie}`);
          if (!res.data || res.data.length === 0) {
            throw new Error("No products found");
          }
          return res.data;
        } catch (error) {
          throw error;  
        }
      }
)
export const fetchFeuerloescherById = createAsyncThunk(
    "products/productsFetchById",
    async({idProdukt, kategorie}) => {
        try{
            const res = await axios.get(`http://localhost:8800/produkte/${idProdukt}`, {
                params: { kategorie: "feuerloescher"},
            });
            return res?.data;
            
        }catch (error) {
            console.error("API Error:", error);
            throw error;
        }
    }
)




const productsSlice = createSlice({
    name: "products",
    initialState: {
        items: [],
        selectedItem: null,
        status: null
    },
    reducers: {
        clearFeuerloescher: (state) => {
            state.items = [];
            state.status = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFeuerloescher.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchFeuerloescher.fulfilled, (state, action) => {
                state.items = action.payload
                state.status = "success"
            })
            .addCase(fetchFeuerloescher.rejected, (state) => {
                state.status = "failed"
            })
            
            .addCase(fetchFeuerloescherById.pending, (state) => {
                state.status = "loading"
            })
            .addCase(fetchFeuerloescherById.fulfilled, (state, action) => {
                state.selectedItem = action.payload
                state.status = "success"
            })
            .addCase(fetchFeuerloescherById.rejected, (state) => {
                state.status = "failed"
            })

    }

    

})

export default productsSlice.reducer;