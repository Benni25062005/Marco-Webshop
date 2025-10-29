import { Routes, Route, Navigate } from "react-router-dom";
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
import VerifyEmail from "../features/auth/VerifyEmail";
import ProduktListe from "../pages/ProduktListe";
import ProduktDetail from "../pages/ProduktDetail";
import CheckoutResult from "../features/order/CheckoutResult";
import Bestellungen from "../pages/Bestellungen";
import TwintPaymentPage from "../pages/TwintPaymentPage";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import Impressum from "../pages/Impressum";
import AgbPage from "../pages/AgbPage";
import Datenschutz from "../pages/Datenschutz";
import RequireAdmin from "../features/admin/RequireAdmin";
import AdminDashboard from "../features/admin/AdminDashboard";
import AdminUsersPage from "../features/admin/pages/User/Admin.UsersPage";
import AdminProductsPage from "../features/admin/pages/Product/Admin.ProductsPage";
import AdminProductDetail from "../features/admin/pages/Product/Admin.ProductDetails";
import AdminProductAdd from "../features/admin/pages/Product/Admin.ProductAdd";
import AdminOverview from "../features/admin/AdminOverview";

export default function AppRoutes() {
  return (
    <Routes>
      <Route index element={<Dashboard />} />
      <Route path="home" element={<Dashboard />} />
      <Route path="feuerloescher" element={<Feuerloescher />} />
      <Route path="produkte" element={<ProduktListe />} />
      <Route path="produkt/:id" element={<ProduktDetail />} />
      <Route path="brandschutz" element={<Brandschutz />} />
      <Route path="kontakt" element={<Kontakt />} />
      <Route path="impressum" element={<Impressum />} />
      <Route path="agb" element={<AgbPage />} />
      <Route path="datenschutz" element={<Datenschutz />} />
      <Route path="login" element={<Login />} />
      <Route path="registrierung" element={<Registrierung />} />
      <Route path="warenkorb" element={<Warenkorb />} />
      <Route path="checkout" element={<CheckoutResult />} />
      <Route path="twint-payment" element={<TwintPaymentPage />} />
      <Route path="checkout-success" element={<CheckoutSuccess />} />
      <Route path="bestellungen" element={<Bestellungen />} />
      <Route path="feuerungskontrolle" element={<Feuerungskontrolle />} />
      <Route path="feuerloescher/:id" element={<FeuerloescherDetail />} />
      <Route
        path="profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />
      <Route path="not-found" element={<NotFound />} />
      <Route path="verify-email" element={<VerifyEmail />} />

      <Route element={<RequireAdmin />}>
        <Route path="admin" element={<AdminDashboard />}>
          <Route index element={<AdminOverview />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AdminProductAdd />} />
          <Route path="products/:id" element={<AdminProductDetail />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  );
}
