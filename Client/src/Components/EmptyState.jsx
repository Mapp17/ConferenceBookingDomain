

function EmptyState({ filter }) {
  return (
    <div className="empty-state">
      <h3>No Bookings Found</h3>
      <p>
        {filter === "All" 
          ? "No bookings to display. Create a new booking to get started."
          : `No ${filter.toLowerCase()} bookings to display.`}
      </p>
    </div>
  );
}

export default EmptyState;