import ConnectionStatus from "./ConnectionStatus";
import "./Navbar.css";

function Navbar() {
  return (
          <nav className="app-header">
                  <div className="header-content">
                    <h1>Conference Booking System</h1>
                    <p className="header-description">Manage and track all room bookings</p>
                  </div>
                  <div className="connection-badge">
                    <span className="status-dot"></span>
                    <span className="connection-text"><ConnectionStatus /></span>
                  </div>
                </nav>
  );
}

export default Navbar;