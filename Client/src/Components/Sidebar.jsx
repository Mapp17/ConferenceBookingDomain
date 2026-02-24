

function Sidebar({ 
  statusFilter, 
  onStatusChange, 
  totalBookings, 
  statusCounts 
}) {
  const filters = ["All", "Pending", "Confirmed", "Cancelled", "Completed"];
  
  const getFilterCount = (filter) => {
    if (filter === "All") return totalBookings;
    return statusCounts[filter.toLowerCase()] || 0;
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3 className="sidebar-title">Filters</h3>
        <div className="filter-list">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-button ${statusFilter === filter ? 'active' : ''}`}
              onClick={() => onStatusChange(filter)}
            >
              <span>{filter}</span>
              <span className="filter-count">{getFilterCount(filter)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-title">Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total Bookings</span>
            <span className="stat-value">{totalBookings}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active</span>
            <span className="stat-value">
              {statusCounts.pending + statusCounts.confirmed}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed</span>
            <span className="stat-value">{statusCounts.completed}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;