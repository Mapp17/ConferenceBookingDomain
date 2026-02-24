export function formatDisplayDate(dateString) {
  if (!dateString) return "Date not available";

  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "Invalid date";
  }
}

export function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return null;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end - start;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
    }
  } catch {
    return null;
  }
}