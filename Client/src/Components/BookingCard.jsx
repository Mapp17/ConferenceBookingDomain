import Button from "./Button"

function BookingCard({
  roomName,
  date,
  userName,
  onCancel
}) {
  return (
    <div className="booking-card">
      <h3>{roomName}</h3>
      <p>Date: {date}</p>
      <p>Booked by: {userName}</p>

      <Button 
        label="Cancel Booking" 
        onClick={onCancel} 
      />
    </div>
  )
}

export default BookingCard;
