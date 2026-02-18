import React, { useEffect } from "react";

function Header() {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Checking for updates...");
    }, 3000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  return <header><h2>Conference Booking System</h2></header>;
}

export default Header;