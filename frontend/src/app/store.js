// src/app/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Standard: localStorage
import { combineReducers } from "redux";

import productsReducer from "../features/products/productsSlice";
import userReducer from "../features/user/userSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";
import orderReducer from "../features/order/orderSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  user: userReducer,
  auth: authReducer,
  cart: cartReducer,
  order: orderReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Persistor exportieren
export const persistor = persistStore(store);

export default store;
