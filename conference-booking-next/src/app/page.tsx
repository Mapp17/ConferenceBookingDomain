'use client';

import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-300 to-primary-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center text-black">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Conference Booking System</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Streamline your meeting room reservations with our intuitive booking platform
          </p>
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-3 bg-black text-white rounded-lg font-semibold 
                     hover:bg-gray-100 transition-colors text-lg"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}