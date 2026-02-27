import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import axios from "axios";

export function useBookings(page = 1, pageSize = 10) {
  const [bookings, setBookings] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await apiClient.get(
          `/bookings/allbookings?page=${page}&pageSize=${pageSize}`,
          { signal: controller.signal }
        );


        setBookings(data.items ?? []);
      } catch (err) {
   
        if (axios.isCancel(err)) {
          return;
        }


        if (err.code === "ECONNABORTED") {
          setError("The server took too long to respond. Please try again.");
          return;
        }

        if (!err.response) {
          setError("Cannot reach the server. Please check your connection.");
          return;
        }


        const status = err.response.status;
        const message =
          err.response.data?.message || "An unexpected server error occurred";

        setError(`Server error (${status}): ${message}`);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();


    return () => controller.abort();
  }, [page, pageSize]);

  return { bookings, loading, error };
}

