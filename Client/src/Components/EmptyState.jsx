function EmptyState({ statusFilter }) {
  return (
    <div className="empty-state">
      <h3>No Bookings Found</h3>
      <p>
        No {statusFilter !== "All" ? statusFilter.toLowerCase() : ""} bookings to display.
      </p>
    </div>
  );
}

export default EmptyState;