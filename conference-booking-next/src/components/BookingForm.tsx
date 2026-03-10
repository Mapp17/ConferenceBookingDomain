'use client';

import { useState } from 'react';
import Button from './Button';

interface BookingFormProps {
  onAddBooking: (booking: any) => void;
}

export default function BookingForm({ onAddBooking }: BookingFormProps) {
  const [roomName, setRoomName] = useState('');
  const [date, setDate] = useState('');
  const [userName, setUserName] = useState('');

  const clearForm = () => {
    setRoomName('');
    setDate('');
    setUserName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newBooking = {
      id: Date.now(),
      roomName,
      date,
      userName,
    };

    onAddBooking(newBooking);
    clearForm();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Create New Booking</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Room Name:</label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User Name:</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" label="Clear" onClick={clearForm} variant="secondary" />
          <Button type="submit" label="Create Booking" variant="primary" />
        </div>
      </div>
    </form>
  );
}