import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(null);

  const pingBackend = async () => {
    try {
      const response = await fetch(`${API_URL}/bookings`);

      if (!response.ok) {
        throw new Error("Backend not reachable");
      }

      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  useEffect(() => {
    pingBackend();

    // Optional: re-check every 10 seconds
    const interval = setInterval(pingBackend, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="connection-status">
      {isConnected === null && (
        <span style={{ color: "gray" }}>Checking connection...</span>
      )}

      {isConnected === true && (
        <span style={{ color: "#2ecc71", fontWeight: "bold" }}>
           Connected
        </span>
      )}

      {isConnected === false && (
        <span style={{ color: "red", fontWeight: "bold" }}>
           Backend Offline
        </span>
      )}
    </div>
  );
}

export default ConnectionStatus;