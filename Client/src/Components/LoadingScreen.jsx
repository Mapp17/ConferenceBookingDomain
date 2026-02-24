

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <h2>Conference Booking System</h2>
        <p>Connecting to service...</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
}

export default LoadingScreen;