import { createAsyncThunk, createSlice, } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [],
}

export const fetchCart = createAsyncThunk(
    "cart/fetchCartDB",
    async (user_id, { rejectWithValue}) => {
        try {
            const response = await axios.get(`http://localhost:8800/api/cartItems` , {
                params: { user_id}
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const addItemToCart = createAsyncThunk(
    "cart/addItemToCartDB",
    async ({ user_id, product, menge }, { dispatch, rejectWithValue }) => {
        try {
            await axios.post("http://localhost:8800/api/cart", {
                user_id,
                product_id: product.idProdukt,
                menge,
            });

            dispatch(addToCart({
                product_id: product.idProdukt,
                name: product.Name,
                preis: product.Preis_brutto,
                bild: product.Bild,
                menge,
            }));

        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)

export const removeItemFromCart = createAsyncThunk(
    "cart/removeItemFromCartDB",
    async ({ user_id, product_id}, {dispatch, rejectWithValue}) => {
        try {
            const response = await axios.delete( 
                `http://localhost:8800/api/cart/${user_id}/${product_id}`
            );
            dispatch(removeFromCart({product_id}));
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || {message: "Unbekannter Fehler"});
        }
    }
)

export const updateItemQuantity = createAsyncThunk(
    "cart/updateItemQuantityDB", 
    async ({ user_id, product_id, menge}, {dispatch, rejectWithValue}) => {
        try {
            const response = await axios.put(
                `http://localhost:8800/api/cart/${user_id}/${product_id}`,
                { menge }
            );
            dispatch(updateQuantity({ product_id, menge}))
            return response.data;
        } catch (error){
            return rejectWithValue(error.response?.data || {message: "unbekannter Fehler"});
        }
    }
)



const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload;
            const existing = state.items.find(i => i.product_id === item.product_id);

            if (existing) {
                existing.menge += item.menge || 1;
            } else {
                state.items.push({
                    ...item,
                    menge: item.menge || 1,
                });
            }
        },
        removeFromCart: (state, action) => {
            state.items = state.items.filter(i => i.product_id !== action.payload.product_id);
        },
        updateQuantity: (state, action) => {
            const { product_id, menge } = action.payload;
            const item = state.items.find(i => i.product_id === product_id);
            if (item) {
                item.menge = menge;
            }
        },
        clearCart: (state) => {
            state.items = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

    }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart} = cartSlice.actions;
export default cartSlice.reducer;
