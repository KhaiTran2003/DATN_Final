import React, { useState, useEffect } from "react";
import logo from "../images/LCMSlogo.jpg";
import { Link } from "react-router-dom";

function Navbar() {
  const [nav, setNav] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 50) {
      setNav(true);
    } else {
      setNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
      ${nav ? "bg-black shadow-lg" : "bg-transparent"}`}
    >
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="Logo" className="w-16 h-auto" />
        </Link>

        {/* Menu button - Mobile View */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white mb-1"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Menu */}
        <ul
          className={`lg:flex lg:space-x-6 text-white uppercase tracking-wide font-medium transition-all 
          ${isMenuOpen ? "block" : "hidden"} absolute lg:relative top-16 lg:top-0 left-0 w-full lg:w-auto 
          bg-black lg:bg-transparent shadow-md lg:shadow-none lg:flex-row flex flex-col`}
        >
          <li>
            <Link to="/homepage" className="block px-6 py-3 lg:py-0 hover:bg-red-600 lg:hover:bg-transparent lg:hover:text-red-600">Home</Link>
          </li>
          <li>
            <Link to="/aboutus" className="block px-6 py-3 lg:py-0 hover:bg-red-600 lg:hover:bg-transparent lg:hover:text-red-600">Features</Link>
          </li>
          <li>
            <Link to="/courses" className="block px-6 py-3 lg:py-0 hover:bg-red-600 lg:hover:bg-transparent lg:hover:text-red-600">Courses</Link>
          </li>
          <li>
            <Link to="/reviews" className="block px-6 py-3 lg:py-0 hover:bg-red-600 lg:hover:bg-transparent lg:hover:text-red-600">Reviews</Link>
          </li>
          <li>
            <Link to="/contact" className="block px-6 py-3 lg:py-0 hover:bg-red-600 lg:hover:bg-transparent lg:hover:text-red-600">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;