import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "../pages/Dashboard";
import Feuerloescher from "../features/feuerloescher/Feuerloescher";
import Brandschutz from "../pages/Brandschutz";
import Kontakt from "../pages/Kontakt";
import Feuerungskontrolle from "../pages/Feuerungskontrolle";
import FeuerloescherDetail from "../features/feuerloescher/FeuerloescherDetail";
import NotFound from "../pages/NotFound";
import Login from "../features/auth/Login";
import Registrierung from "../features/auth/Registrierung";
import Warenkorb from "../features/cart/Warenkorb";
import Profile from "../features/user/Profile";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="home" element={<Dashboard />} />
      <Route path="feuerloescher" element={<Feuerloescher />} />
      <Route path="brandschutz" element={<Brandschutz />} />
      <Route path="kontakt" element={<Kontakt />} />
      <Route path="login" element={<Login />} />
      <Route path="registrierung" element={<Registrierung />} />
      <Route path="warenkorb" element={<Warenkorb />} />
      <Route path="feuerungskontrolle" element={<Feuerungskontrolle />} />
      <Route path="feuerloescher/:id" element={<FeuerloescherDetail />} />
      <Route path="profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
