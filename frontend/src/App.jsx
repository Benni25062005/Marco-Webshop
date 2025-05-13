import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Dashboard from "./Dashboard"
import Feuerloescher from "./Feuerloescher"
import Brandschutz from "./Brandschutz"
import Kontakt from "./Kontakt"
import Feuerungskontrolle from "./Feuerungskontrolle"
import FeuerloescherDetail from "./FeuerloescherDetail"
import NotFound from "./NotFound"
import Login from "./Login"
import Registrierung from "./Registrierung"
import Warenkorb from "./Warenkorb";
import Profile from "./Profile";
import ScrollToTop from "./components/ScrollToTop"
import PrivateRoute from "./components/PrivateRoute";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthFromStorage } from "./features/authSlice";

export default function App(){
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Loading auth  from storage");
        dispatch(setAuthFromStorage());
    }, [dispatch]);
    

    return(<>
        <div className="flex flex-col min-h-screen">
            <Header />
            <Toaster position="top-center" reverseOrder={false} />
                <main className="flex-grow">
                    <ScrollToTop />
                    <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="main" element={<Dashboard />} />
                            <Route path="feuerloescher" element={<Feuerloescher/>} />
                            <Route path="brandschutz" element={<Brandschutz/>} />
                            <Route path="kontakt" element={<Kontakt/>} />
                            <Route path="login" element={<Login/>} />
                            <Route path="registrierung" element={<Registrierung/>} />
                            <Route path="warenkorb" element={<Warenkorb/>} />
                            <Route path="not-found" element={<NotFound/>} />
                            <Route path="feuerungskontrolle" element={<Feuerungskontrolle/>} />
                            <Route path="feuerloescher/:id" element={<FeuerloescherDetail/>} />
                            <Route path="profile" element={<PrivateRoute><Profile/></PrivateRoute>} />
                            <Route path="*" element={<Navigate to="/not-found" replace />} />
                        </Routes>
                </main>
            <Footer/>
        </div>
        
    </>)
}
