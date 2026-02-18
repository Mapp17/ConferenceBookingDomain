import { useState } from "react";
import Button from "./Button";
import "./BookingForm.css";

function BookingForm({ onAddBooking }) {

  const [roomName, setRoomName] = useState("");
  const [date, setDate] = useState("");
  const [userName, setUserName] = useState("");


  const clearForm = () => {
    setRoomName("");
    setDate("");
    setUserName("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      id: id,
      roomName: roomName,
      date: date,
      userName: userName,
    };

    onAddBooking(newBooking);
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit}
     className="form">
      <h2>Create New Booking</h2>

      <div>
        <label>Room Name:</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Date:</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div>
        <label>User Name:</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
      </div>

      
        <Button type="button" label="Clear" onClick={clearForm} />
        <Button type="submit" label="Create Booking" />
    </form>
  );
}

export default BookingForm;
