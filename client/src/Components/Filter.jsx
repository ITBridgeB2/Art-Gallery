import React from 'react';

const ArtFilter = ({ selectedStyle, onChange }) => {
  const styles = ['All', 'Painting', 'Sculpture', 'Photography', 'Other'];

  return (
    <div className="flex items-center justify-center mb-6">
      <label htmlFor="style-select" className="mr-3 text-lg font-semibold text-gray-700">
        Filter by Art Style:
      </label>
      <select
        id="style-select"
        value={selectedStyle}
        onChange={(e) => onChange(e.target.value)}
        className="w-64 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
      >
        {styles.map((style) => (
          <option key={style} value={style}>
            {style}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ArtFilter;
