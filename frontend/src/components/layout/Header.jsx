import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, UserRound, ShoppingCart } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import NavItem from "../common/NavItem";

const logoUrl = new URL("../../../assets/Logo_Marco.png", import.meta.url).href;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userRef = useRef(null);

  // Outside-Click für User-Menü + ESC für beide Menüs
  useEffect(() => {
    const onClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Body-Scroll sperren, wenn Mobile-Menü offen
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => (document.body.style.overflow = "");
  }, [menuOpen]);

  const handleLogout = (e) => {
    e.stopPropagation();
    dispatch(logout());
    navigate("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-[95rem] mx-auto h-20 px-4">
          <div className="h-full flex items-center justify-between relative">
            {/* Logo */}
            <Link to="/home" className="flex items-center pl-6">
              <img
                src={logoUrl}
                alt="Logo"
                className="max-w-xs h-16 md:h-18 lg:h-20 object-contain cursor-pointer"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 lg:space-x-8 text-lg md:text-xl lg:text-2xl font-medium h-full">
              <NavItem to="/home" label="Home" />
              <NavItem to="/produkte" label="Produkte" />
              <NavItem to="/brandschutz" label="Brandschutz" />
              <NavItem to="/feuerungskontrolle" label="Feuerungskontrollen" />
              <NavItem to="/service" label="Service" />
              {user?.role === "admin" && <NavItem to="/admin" label="Admin" />}
            </nav>

            {/* Icons + Mobile Toggle */}
            <div className="flex items-center justify-end space-x-6 pr-4">
              {/* User Menu */}
              <div className="relative" ref={userRef}>
                <button
                  aria-label="Benutzermenü"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!user) {
                      navigate("/login");
                      return;
                    }
                    setUserMenuOpen((prev) => !prev);
                  }}
                >
                  <UserRound className="h-8 w-8 align-middle cursor-pointer mt-2" />
                </button>

                {userMenuOpen && user && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-[60]">
                    <button
                      onClick={() => {
                        navigate("/profile");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Profil
                    </button>
                    <button
                      onClick={() => {
                        navigate("/bestellungen");
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Bestellungen
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 font-medium text-red-600 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/warenkorb" aria-label="Warenkorb">
                <ShoppingCart className="h-8 w-8 align-middle cursor-pointer" />
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2"
                aria-label="Menü umschalten"
                onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation (Overlay + Panel, unterhalb Headerhöhe 80px) */}
        {menuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            />
            {/* Panel */}
            <div className="fixed top-20 left-0 right-0 z-50 md:hidden">
              <div className="mx-4 rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                <nav className="flex flex-col items-stretch divide-y divide-gray-100 text-lg font-medium">
                  <Link
                    to="/home"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 hover:bg-gray-50"
                  >
                    Home
                  </Link>
                  <Link
                    to="/produkte"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 hover:bg-gray-50"
                  >
                    Produkte
                  </Link>
                  <Link
                    to="/brandschutz"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 hover:bg-gray-50"
                  >
                    Brandschutz
                  </Link>
                  <Link
                    to="/feuerungskontrolle"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 hover:bg-gray-50"
                  >
                    Feuerungskontrollen
                  </Link>
                  <Link
                    to="/service"
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-3 hover:bg-gray-50"
                  >
                    Service
                  </Link>
                </nav>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
