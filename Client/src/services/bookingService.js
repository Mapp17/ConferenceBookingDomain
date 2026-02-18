import mockBookings from "../data/mockData";

export function fetchAllBookings() {
  return new Promise((resolve, reject) => {
    const delay = Math.floor(Math.random() * 2000) + 500; // 500–2500ms
    const shouldFail = Math.random() < 0.2; // 20% failure

    setTimeout(() => {
      if (shouldFail) {
        reject(new Error("Failed to fetch bookings. Please try again."));
      } else {
        resolve(mockBookings);
      }
    }, delay);
  });
}
