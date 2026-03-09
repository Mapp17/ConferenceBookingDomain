import { useEffect } from "react";
import "../ConferenceBooking.css";


function Header( { currentPage, setCurrentPage }) {
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log("Checking for updates...");
    }, 3000);

    // Cleanup function
    return () => clearInterval(intervalId);
  }, []);

  return (
     <div className="page-header">
            <h2 className="page-title">Current Bookings</h2>
            <div className="pagination-controls">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ← Previous
              </button>
              <span className="page-indicator">Page {currentPage}</span>
              <button 
                onClick={() => setCurrentPage(p => p + 1)}
                className="pagination-button"
              >
                Next →
              </button>
            </div>
          </div>
  );
}

export default Header;