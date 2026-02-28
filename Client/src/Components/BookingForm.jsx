import { useState } from "react";
import Button from "./Button";
import "./BookingForm.css";

function BookingForm({ onSubmit, onClose, error }) {
  const [roomName, setRoomName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const clearForm = () => {
    setRoomName("");
    setUserEmail("");
    setStart("");
    setEnd("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      roomName,
      userEmail,
      start,
      end
    });

    clearForm();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h2>Create New Booking</h2>

      <div>
        <label>Room Name</label>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          required
        />
      </div>

      <div>
        <label>User Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </div>

      <div>
        <label>End Time</label>
        <input
          type="datetime-local"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="form-actions">
        <Button type="button" label="Clear" onClick={clearForm} />
        <Button type="button" label="Cancel" onClick={onClose} />
        <Button type="submit" label="Create Booking" />
      </div>
    </form>
  );
}

export default BookingForm;