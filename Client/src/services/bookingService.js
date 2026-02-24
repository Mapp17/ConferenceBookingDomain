class BookingService {
  async getAllBookings(apiUrl, page, pageSize) {
    try {
      const url = `${apiUrl}/api/bookings/allbookings?page=${page}&pageSize=${pageSize}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        items: data.items || [],
        totalCount: data.totalCount || 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch bookings: ${error.message}`);
    }
  }

  async cancelBooking(apiUrl, bookingId) {
    try {
      const response = await fetch(`${apiUrl}/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      return response.ok;
    } catch (error) {
      throw new Error(`Failed to cancel booking: ${error.message}`);
    }
  }
}

export default new BookingService();