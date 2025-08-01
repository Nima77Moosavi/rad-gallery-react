import React, { useState, useEffect } from "react";
import HeaderDesktop from "../HeaderDesktop/HeaderDesktop";
import HeaderMobile from "../HeaderMobile/HeaderMobile";

const Header = () => {
  // Set your breakpoint (e.g., 768px) and check whether the viewport is below that value.
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      // Check the viewport width and update state accordingly.
      setIsMobile(window.innerWidth < 768);
    };

    // Listen for window resize events.
    window.addEventListener("resize", handleResize);
    // Call handleResize once at mount to adjust for the initial window size.
    handleResize();

    // Clean up the event listener on component unmount.
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conditionally render HeaderMobile or HeaderDesktop.
  return <>{isMobile ? <HeaderMobile /> : <HeaderDesktop />}</>;
};

export default Header;
