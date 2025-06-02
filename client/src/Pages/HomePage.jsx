// src/pages/Home.jsx
import React from 'react';
import Navbar from '../Components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-10">
        {/* Placeholder UI layout, ready for integration of search/filter/sort and artwork grid */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Discover Incredible Artworks</h1>
          <p className="text-gray-600 mt-2">Browse, filter, and enjoy creativity at its finest.</p>
        </div>

        {/* Artwork grid placeholder */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {/* Art cards will go here */}
          <div className="h-40 bg-white rounded-xl shadow border flex items-center justify-center text-gray-400">
            🎨 Art Card Placeholder
          </div>
          {/* Repeat as needed */}
        </div>
      </main>
    </div>
  );
};

export default Home;
