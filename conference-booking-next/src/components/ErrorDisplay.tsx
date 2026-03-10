'use client';

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="text-center p-16 bg-white rounded-xl border border-red-200 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Something went wrong</h3>
      <p className="text-red-600 mb-6">{error}</p>
      <button
        onClick={onRetry}
        className="px-6 py-2 bg-blue-400 text-black rounded-md hover:bg-primary-500 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}