import React, { useEffect } from "react";
import ConnectionStatus from "./ConnectionStatus";

function Header() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Checking for updates...");
    }, 3000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="header">
      <h1>Conference Booking System</h1>

      {/* ✅ Backend connection indicator */}
      <ConnectionStatus />
    </header>
  );
}

export default Header;