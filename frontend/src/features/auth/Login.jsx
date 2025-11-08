import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "./authSlice";
import toast from "react-hot-toast";
import ResetPasswortModal from "../../components/common/modals/ResetPasswortModal";

const open = new URL("../../../assets/eye_open.png", import.meta.url).href;
const closed = new URL("../../../assets/eye_close.png", import.meta.url).href;

export default function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Bitte füllen Sie alle Felder aus.");
      return;
    }

    setLoading(true);

    const userData = {
      email,
      password,
    };

    dispatch(loginUser(userData))
      .then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Login erfolgreich");
          const payload = res.payload;
          const role = payload?.user?.role ?? payload?.role ?? "user";

          navigate(role === "admin" ? "/admin" : "/home", { replace: true });
        } else {
          const message =
            typeof res.payload === "string"
              ? res.payload
              : res.payload?.message || "Login fehlgeschlagen";

          toast.error(message);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[2px] bg-gray-300 opacity-80 rounded-full animate-pulse" />
        </div>
      )}

      {resetPassword && (
        <div className="flex items-center justify-center gap-2">
          <ResetPasswortModal
            isOpen={resetPassword}
            onClose={() => setResetPassword(false)}
          />
        </div>
      )}

      <div className="flex flex-col justify-center items-center mt-36 w-full">
        <h1 className="text-2xl font-medium">Sign In to Marcos Webshop</h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 mt-8 max-w-sm w-full px-4"
        >
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-100 rounded-xl p-1 shadow-sm focus:shadow-md focus:border focus:border-red-600 p-2 focus:ring-bgorange focus:outline-none transition duration-300"
            placeholder="Email"
            type="email"
            id="email"
          />

          <div className="relative">
            <input
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-100 rounded-xl p-2 shadow-sm w-full pr-10 focus:shadow-md focus:border focus:border-red-600 focus:ring-bgorange focus:outline-none transition duration-300"
              placeholder="Passwort"
              type={showPassword ? "text" : "password"}
              id="password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src={showPassword ? open : closed}
                alt="Toggle password"
                className="h-5 w-5"
              />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-y-4 lg:w-full">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white text-md font-bold py-2 px-6 rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Login..." : "Login"}
            </button>
          </div>

          <div className="flex items-center justify-center gap-2">
            <p>Noch kein Konto?</p>
            <Link to="/registrierung" className="text-red-600 font-medium">
              Jetzt registrieren
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 -mt-4">
            <button
              type="button"
              onClick={() => setResetPassword(true)}
              className="text-red-600 font-medium"
            >
              Passwort vergessen
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
