import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useSelector } from "react-redux";
import logo from "../../assets/Logo_Marco1.png";
import profile from "../../assets/profile.png";
import cart from "../../assets/shopping_cart.png";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const token = useSelector((state) => state.auth.token);

  return (
    <header className="w-full border-b bg-bgorange border-bgorange  px-4 py-2">
      <div className="max-w-[85rem] mx-auto flex items-center justify-between relative">
        {/* Logo */}
        <Link to="/main" className="flex justify-start flex-shrink-0 mr-24 ">
          <img
            src={logo}
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
          <Link to={token ? "/profile" : "/login"}>
            <img src={profile} className="cursor-pointer h-8 md:h-10" alt="Profile" />
          </Link>

          <Link to="/warenkorb">
          <img src={cart} className="cursor-pointer h-8 md:h-10" alt="Cart" />
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
