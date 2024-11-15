import React, { useState, useEffect } from "react";
import "../css/header.css";  // Import CSS for the header
import logo from '../images/1.png';

const Header = () => {
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollPos, setLastScrollPos] = useState(0);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos < lastScrollPos) {
      setIsScrollingUp(true);  // Scrolling up
    } else {
      setIsScrollingUp(false); // Scrolling down
    }
    setLastScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup
    };
  }, [lastScrollPos]);

  return (
    <header className={`app-header ${isScrollingUp ? "visible" : "hidden"}`}>
      <img src={logo} alt="App Logo" className="logo" />
    </header>
  );
};

export default Header;
