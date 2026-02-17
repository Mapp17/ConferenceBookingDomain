import Button from "./Button"
import "./BookingCard.css"

function BookingCard({
  roomName,
  date,
  userName,
  onCancel
}) {
  return (
    <div className="bookingCard">
      <h3>{roomName}</h3>
      <p>Date: {date}</p>
      <p>Booked by: {userName}</p>

      <Button 
        label="Cancel" 
        onClick={onCancel} 
      />
    </div>
  )
}

export default BookingCard;
