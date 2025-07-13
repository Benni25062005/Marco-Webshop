// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../features/products/productsSlice';
import userReducer from '../features/user/userSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';

const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
