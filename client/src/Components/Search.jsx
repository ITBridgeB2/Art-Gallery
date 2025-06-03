import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchArtworks = ({ searchTerm, onSearchChange, artworks }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const matches = artworks.filter(
      (art) =>
        (art.title && art.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (art.artist && art.artist.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setSuggestions(matches.slice(0, 5));
  }, [searchTerm, artworks]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      setHighlightedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && highlightedIndex >= 0) {
      navigate(`/artworks/${suggestions[highlightedIndex].id}`);
    }
  };

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-purple-600">Search Artworks</h2>
      <input
        type="text"
        placeholder="Search by title or artist..."
        value={searchTerm}
        onChange={(e) => {
          onSearchChange(e.target.value);
          setHighlightedIndex(-1);
        }}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        aria-label="Search artworks"
      />
      {suggestions.length > 0 && (
        <ul className="bg-white border mt-1 rounded shadow absolute z-50 w-full max-w-lg">
          {suggestions.map((sugg, index) => (
            <li
              key={sugg.id}
              onClick={() => navigate(`/artworks/${sugg.id}`)}
              className={`px-4 py-2 cursor-pointer hover:bg-purple-100 ${
                highlightedIndex === index ? 'bg-purple-100' : ''
              }`}
            >
              {sugg.title} — {sugg.artist}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default SearchArtworks;
