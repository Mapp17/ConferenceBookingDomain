import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import * as signalR from "@microsoft/signalr";

export function useBookings(page = 1, pageSize = 10) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔴 SIGNALR — LIVES HERE
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5151/hubs/bookings", {
        accessTokenFactory: () => localStorage.getItem("token"),
      })
      .withAutomaticReconnect()
      .build();

    connection.start()
      .then(() => console.log("✅ SignalR connected"))
      .catch(err => console.error("❌ SignalR error:", err));

    connection.on("BookingCreated", booking => {
      setBookings(prev => [booking, ...prev]);
    });

    connection.on("BookingUpdated", booking => {
      setBookings(prev =>
        prev.map(b => b.id === booking.id ? booking : b)
      );
    });

    // ✅ CLEANUP (NO MEMORY LEAKS)
    return () => {
      connection.stop();
    };
  }, []);

  // 🔵 NORMAL API FETCH
  useEffect(() => {
    const controller = new AbortController();

    const loadBookings = async () => {
      setLoading(true);
      try {
        const data = await apiClient.get(
          `/bookings/allbookings?page=${page}&pageSize=${pageSize}`,
          { signal: controller.signal }
        );
        setBookings(data.items ?? []);
      } catch (err) {
        setError("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
    return () => controller.abort();
  }, [page, pageSize]);

  return { bookings, loading, error };
}