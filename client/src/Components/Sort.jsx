import React from 'react';

const SortArtworks = ({ selectedSort, onChange }) => {
  const options = [
    { label: 'Newest First', value: 'newest' },
    { label: 'Oldest First', value: 'oldest' },
    { label: 'A-Z Title', value: 'title_asc' },
    { label: 'Z-A Title', value: 'title_desc' },
  ];

  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Sort by:</label>
      <select
        value={selectedSort}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border rounded w-full"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SortArtworks;
