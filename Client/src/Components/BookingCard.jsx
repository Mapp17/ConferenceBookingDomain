import { formatDisplayDate, calculateDuration } from "../utils/dateUtils";
import "./BookingCard.css";

function BookingCard({
  id,
  roomName,
  start,
  end,
  userEmail,
  status,
  onCancel
}) {
  const canCancel = status !== 'Cancelled' && status !== 'Completed';
  const duration = calculateDuration(start, end);

  const handleCancelClick = () => {
    if (window.confirm(`Are you sure you want to cancel this booking for ${roomName}?`)) {
      onCancel(id);
    }
  };

  return (
    <div className="booking-card">
      <div className="card-header">
        <h4 className="room-name">{roomName}</h4>
        <span className={`status-badge status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="card-body">
        <div className="datetime-group">
          <div className="datetime-item">
            <span className="datetime-label">Start</span>
            <span className="datetime-value">{formatDisplayDate(start)}</span>
          </div>
          <div className="datetime-item">
            <span className="datetime-label">End</span>
            <span className="datetime-value">{formatDisplayDate(end)}</span>
          </div>
          {duration && (
            <div className="duration-badge">
              Duration: {duration}
            </div>
          )}
        </div>

        <div className="booker-info">
          <span className="booker-label">Booked by</span>
          <span className="booker-value">{userEmail}</span>
        </div>
      </div>

      {canCancel && (
        <div className="card-footer">
          <button
            onClick={handleCancelClick}
            className="cancel-button"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}

export default BookingCard;