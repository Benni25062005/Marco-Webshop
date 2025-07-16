import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { User, ShoppingCart, UserRound, ChevronDown, ChevronUp } from "lucide-react";
import NavItem from "../common/NavItem";

const logoUrl = new URL("../../../assets/Logo_Marco.png", import.meta.url).href;


export default function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [isDropdownOpen, setIsDropdownopen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const timoutRef = useRef(null);
 

  useEffect(() => {
    console.log(window.location.href)
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

  const handleMouseEnter = () => {
    clearTimeout(timoutRef.current);
    setIsDropdownopen(true);
  };

  const handleMouseLeave = () => {
    timoutRef.current = setTimeout(() => {
      setIsDropdownopen(false);
    }, 150);
  }

  return (
    <header className="w-full border-b border-gray h-20 px-4">
      <div className="max-w-[95rem] mx-auto flex items-center relative px-4">
        {/* Logo */}
        <Link to="/home" className="flex-[1] flex items-center pl-6">
          <img
            src={logoUrl} 
            alt="Logo"
            className="h-16 md:h-18 lg:h-20 cursor-pointer "

          />
        </Link>

        <div className="flex items-center justify-end space-x-16 h-full">
            {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-[2] items-center justify-center space-x-6 lg:space-x-8 text-lg md:text-xl lg:text-2xl font-medium h-full">
            <NavItem to="/home" label="Home" />
            <NavItem to="/produkte" label="Produkte" />
            <NavItem to="/brandschutz" label="Brandschutz" />
            <NavItem to="/feuerungskontrolle" label="Feuerungskontrollen" />
          </nav>


          {/* Icons + Mobile Menu Button */}
          <div className="flex-[1] flex items-center justify-end space-x-6 ">
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
                <UserRound className="h-8 w-8 align-middle cursor-pointer mt-2" />
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
              <ShoppingCart className="h-8 w-8 align-middle cursor-pointer"></ShoppingCart>
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
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
