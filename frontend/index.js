import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './src/App.jsx';

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import productsReducer, { fetchFeuerloescher } from './src/features/productsSlice.js';
import userReducer from './src/features/userSlice.js'
import authReducer from './src/features/authSlice.js';
import cartReducer from "./src/features/cartSlice.js";

const store = configureStore({
    reducer:{
        products: productsReducer,
        user: userReducer,
        auth: authReducer,
        cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== 'production',

});

store.dispatch(fetchFeuerloescher());



const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <Provider store = {store}>
        <App />
    </Provider>
        
    </BrowserRouter>
);