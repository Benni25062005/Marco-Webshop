import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './src/App.jsx';
import store from './src/app/store.js';
import { fetchFeuerloescher } from './src/features/products/productsSlice.js';

store.dispatch(fetchFeuerloescher());

const root = ReactDOMClient.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
