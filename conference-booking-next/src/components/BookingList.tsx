'use client';

import BookingCard from './BookingCard';
import { Booking } from '../hooks/useBookings';

interface BookingListProps {
  bookings: Booking[];
  onCancel: (id: number) => void;
}

export default function BookingList({ bookings = [], onCancel }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500">No bookings to display.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          id={booking.id}
          roomName={booking.roomName}
          start={booking.start}
          end={booking.end}
          userEmail={booking.userEmail}
          status={booking.status}
          onCancel={onCancel}
        />
      ))}
    </div>
  );
}