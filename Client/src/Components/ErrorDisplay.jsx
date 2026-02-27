import "../ConferenceBooking.css";

function ErrorDisplay({ error, onRetry }) {
  return (
    <div className="error-state">
      <h3>Something went wrong</h3>
      <p className="error-message">{error}</p>
      <button onClick={onRetry} className="retry-button">
        Try Again
      </button>
    </div>
  );
}

export default ErrorDisplay;