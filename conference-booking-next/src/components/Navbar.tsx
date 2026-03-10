'use client';

import Link from 'next/link';
import ConnectionStatus from './ConnectionStatus';

export default function Navbar() {
  return (
    <nav className="bg-blue-200 border-b border-gray-200 px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-gray-800">Conference Booking System</h1>
          <p className="text-sm text-gray-600">Manage and track all room bookings</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 ">
          <span ></span>
          <Link href="/" className="text-green-700 font-medium hover:underline">
            Home
          </Link>
          <Link href="/login" className="text-green-700 font-medium hover:underline">
            Login
          </Link>
          <Link href="/dashboard" className="text-green-700 font-medium hover:underline">
            Dashboard
          </Link>
          <Link href="/bookings" className="text-green-700 font-medium hover:underline">
            Bookings
          </Link>
        </div>
      </div>
    </nav>
  );
}