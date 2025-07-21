import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex-grow">
        <ScrollToTop />
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}
