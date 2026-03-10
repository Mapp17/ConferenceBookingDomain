'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5151/api";

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  const pingBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/Bookings`);
      setIsConnected(response.ok);
    } catch {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    pingBackend();
    const interval = setInterval(pingBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {isConnected === null && <span className="text-gray-400">Checking...</span>}
      {isConnected === true && <span className="text-green-600 font-bold">Connected</span>}
      {isConnected === false && <span className="text-red-600 font-bold">Backend Offline</span>}
    </>
  );
}