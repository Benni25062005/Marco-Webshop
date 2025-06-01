import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { User, ShoppingCart } from "lucide-react";

const logoUrl = new URL("../../assets/Logo_Marco.png", import.meta.url).href;


export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  }


  return (
    <header className="w-full border-b bg-bgorange border-bgorange  px-4 py-2">
      <div className="max-w-[85rem] mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/main" className="flex justify-start flex-shrink-0 mr-24 ">
          <img
            src={logoUrl} 
            alt="Logo"
            className="h-16 md:h-20 lg:h-28 cursor-pointer"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 lg:space-x-10 text-lg md:text-xl lg:text-3xl font-medium">
          <Link to="/main" className="nav-item hover:text-orange-500">Home</Link>
          <Link to="/feuerloescher" className="nav-item hover:text-orange-500">Feuerlöscher</Link>
          <Link to="/brandschutz" className="nav-item hover:text-orange-500">Brandschutz</Link>
          <Link to="/feuerungskontrolle" className="nav-item hover:text-orange-500">Feuerungskontrollen</Link>
        </nav>

        {/* Icons + Mobile Menu Button */}
        <div className="flex items-center space-x-6 ml-auto">
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => {
                if (token) {
                  setUserMenuOpen(!userMenuOpen);
                } else {
                  navigate("/login");
                }
              }}
              >
              <User className="h-10 w-10 cursor-pointer" />
            </button>

            {userMenuOpen && token && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-50">
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
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 font-medium text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}

          </div>

          <Link to="/warenkorb">
            <ShoppingCart className="h-9 w-9 cursor-pointer"></ShoppingCart>
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 flex flex-col items-center space-y-4 py-6 bg-white text-lg font-medium">
          <Link to="/main" onClick={() => setMenuOpen(false)} className="nav-item hover:text-orange-500">Home</Link>
          <Link to="/feuerloescher" onClick={() => setMenuOpen(false)} className="nav-item hover:text-orange-500">Feuerlöscher</Link>
          <Link to="/brandschutz" onClick={() => setMenuOpen(false)} className="nav-item hover:text-orange-500">Brandschutz</Link>
          <Link to="/feuerungskontrollen" onClick={() => setMenuOpen(false)} className="nav-item hover:text-orange-500">Feuerungskontrollen</Link>
        </div>
      )}
    </header>
  );
}
