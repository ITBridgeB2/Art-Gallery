import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ArtDetailsPage = () => {
  const { id } = useParams();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/artworks/${id}`)
      .then((res) => {
        setArtwork(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Artwork not found");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-4">{artwork.title}</h2>
      <img
        src={`http://localhost:5000${artwork.image_url}`}
        alt={artwork.title}
        className="w-full h-96 object-cover rounded mb-4"
      />
      <p className="text-lg mb-2">Artist: <strong>{artwork.artist}</strong></p>
      <p className="mb-2">Genre: {artwork.genre}</p>
      <p className="mb-2">Description: {artwork.description}</p>
      <p className="text-sm text-gray-500">Created on: {artwork.created_date}</p>
    </div>
  );
};

export default ArtDetailsPage;
