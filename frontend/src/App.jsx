import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/common/ScrollToTop";
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./features/auth/authSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${process.env.BACKEND_URL}/api/user/me`, {
          withCredentials: true,
        });
        dispatch(setUser(res.data.user));
      } catch (err) {
        dispatch(setUser(null));
      }
    };

    checkLogin();
  }, []);

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
