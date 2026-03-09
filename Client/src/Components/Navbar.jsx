import ConnectionStatus from "./ConnectionStatus";
import "./Navbar.css";

function Navbar({onLogout}) {
   const userData = localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null;

    const username = userData?.username || "User";

  return (
          <nav className="app-header">
                  <div className="header-content">
                    <h1>Conference Booking System</h1>
                    <p className="header-description">Manage and track all room bookings</p>
                  </div>

                  <div className="connected-badge">
                    <span className="user-greeting">Hello, {username}</span>
                    <button onClick={onLogout} className="cancel-button">
                      Logout
                    </button>
                  </div>
                </nav>
  );
}

export default Navbar;