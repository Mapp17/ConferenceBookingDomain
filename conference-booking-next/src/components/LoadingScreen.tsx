export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center bg-white p-12 rounded-xl shadow-md border border-gray-200 max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Conference Booking System</h2>
        <p className="text-gray-600 mb-6">Connecting to service...</p>
        <div className="w-10 h-10 border-4 border-gray-200 border-t-primary-400 rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
}