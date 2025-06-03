import React from 'react';
import { Link } from 'react-router-dom';

const ArtList = ({ artworks, loading, selectedSort }) => {
  if (loading) return <div className="p-4">Loading...</div>;

  const sortedArtworks = [...artworks].sort((a, b) => {
    switch (selectedSort) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'title_asc':
        return (a.title || '').localeCompare(b.title || '');
      case 'title_desc':
        return (b.title || '').localeCompare(a.title || '');
      default:
        return 0;
    }
  });

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {sortedArtworks.length === 0 ? (
        <p>No artworks found.</p>
      ) : (
        sortedArtworks.map((art) => (
          <Link to={`/artworks/${art.id}`} key={art.id}>
            <div className="border rounded-lg shadow p-4 hover:shadow-md transition">
              <img
                src={art.image_url ? `http://localhost:5000${art.image_url}` : "https://via.placeholder.com/300x200"}
                alt={art.title}
                className="w-full h-48 object-cover rounded mb-2"
              />
              <h2 className="text-xl font-semibold">{art.title}</h2>
              <p className="text-sm text-gray-600">by {art.artist}</p>
              <p className="text-sm italic">{art.genre}</p>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ArtList;
