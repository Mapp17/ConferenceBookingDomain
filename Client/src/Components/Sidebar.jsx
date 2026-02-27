import ConnectionStatus from "./ConnectionStatus";
import "../ConferenceBooking.css";

function Sidebar({ statusFilter, setStatusFilter, getStatusCount, apiUrl }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filters</h3>
        <div className="filter-list">
          {["All", "Pending", "Confirmed", "Cancelled"].map((filter) => (
            <button
              key={filter}
              className={`filter-button ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => setStatusFilter(filter)}
            >
              <span>{filter}</span>
              <span className="filter-count">{getStatusCount(filter)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Quick Info</h3>
        <div className="info-list">
          <div className="info-item">
            <span className="info-label">API Status</span>
            <span className="info-value online"><ConnectionStatus /></span>
          </div>
          <div className="info-item">
            <span className="info-label">Endpoint</span>
            <span className="info-value endpoint">{apiUrl}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;