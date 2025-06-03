import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import Select from 'react-select';
import { FaStar } from 'react-icons/fa';

const genreOptions = [
  { value: 'Painting', label: 'Painting' },
  { value: 'Sculpture', label: 'Sculpture' },
  { value: 'Photography', label: 'Photography' },
  { value: 'Other', label: 'Other' },
];

const ArtDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(3);
  const [editMode, setEditMode] = useState(false);

  // Form state for editing
  const [form, setForm] = useState({
    title: '',
    artist: '',
    genre: '',
    description: '',
    year: '',
    rating: 0,
    image_url: '',
    imageFile: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchArtwork() {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
        if (res.data) {
          setArtwork(res.data);
          setRating(res.data.rating || 3);

          // Initialize form for edit mode
          setForm({
            title: res.data.title || '',
            artist: res.data.artist || '',
            genre: res.data.genre || '',
            description: res.data.description || '',
            year: res.data.year || '',
            rating: res.data.rating || 0,
            image_url: res.data.image_url || '',
            imageFile: null,
          });

          setError(null);
        } else {
          setError('Artwork not found');
        }
      } catch (err) {
        setError('Failed to load artwork');
      } finally {
        setLoading(false);
      }
    }
    fetchArtwork();
  }, [id]);

  // Handle rating change in view mode (slider)
  async function handleRatingChange(e) {
    const newRating = parseInt(e.target.value);
    setRating(newRating);
    try {
      await axios.patch(`http://localhost:5000/api/artworks/${id}`, { rating: newRating });
      setArtwork((prev) => ({ ...prev, rating: newRating }));
    } catch {
      alert('Failed to update rating');
      setRating(artwork?.rating || 3);
    }
  }

  // Handle edit button click - enable edit mode
  function handleEdit() {
    setEditMode(true);
  }

  // Handle delete artwork
  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this artwork?')) {
      try {
        await axios.delete(`http://localhost:5000/api/artworks/${id}`);
        toast.success('Artwork deleted');
        navigate('/artworks');
      } catch {
        toast.error('Failed to delete artwork');
      }
    }
  }

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Genre change handler for Select component
  const handleGenreChange = (selected) => {
    setForm((prev) => ({ ...prev, genre: selected?.value || '' }));
  };

  // File input change handler
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

  // Handle form submit to update artwork
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!form.title || !form.artist || !form.genre) {
      toast.error('Title, artist, and genre are required');
      return;
    }

    const data = new FormData();
    data.append('title', form.title);
    data.append('artist', form.artist);
    data.append('genre', form.genre);
    data.append('description', form.description || '');
    data.append('year', form.year || '');
    data.append('rating', form.rating || 0);

    if (form.imageFile) {
      data.append('image', form.imageFile);
    }

    try {
      await axios.put(`http://localhost:5000/api/artworks/${id}`, data);
      toast.success('Artwork updated');

      // Refresh artwork data from server after update
      const res = await axios.get(`http://localhost:5000/api/artworks/${id}`);
      setArtwork(res.data);
      setRating(res.data.rating || 3);

      setEditMode(false); // exit edit mode
      setForm((prev) => ({ ...prev, imageFile: null }));
      if (fileInputRef.current) fileInputRef.current.value = ''; // reset file input
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  // Cancel editing and revert changes
  const handleCancelEdit = () => {
    setEditMode(false);
    setForm({
      title: artwork.title || '',
      artist: artwork.artist || '',
      genre: artwork.genre || '',
      description: artwork.description || '',
      year: artwork.year || '',
      rating: artwork.rating || 0,
      image_url: artwork.image_url || '',
      imageFile: null,
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (loading) return <div className="text-center py-10 text-gray-500">Loading artwork...</div>;
  if (error) return <div className="text-center py-10 text-red-600 font-semibold">{error}</div>;
  if (!artwork) return null;

  const isPublic = !!artwork.is_public;

  const images =
    Array.isArray(artwork.image_url) && artwork.image_url.length > 0
      ? artwork.image_url
      : artwork.image_url
      ? [artwork.image_url]
      : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl mt-12 mb-24">
      <Toaster />

      {!editMode ? (
        <>
          <h1 className="text-4xl font-extrabold text-purple-700 mb-4 drop-shadow-sm">{artwork.title}</h1>

          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Artist:</span> {artwork.artist}
          </p>

          <p className="text-lg text-gray-700 mb-2">
            <span className="font-semibold">Year:</span> {artwork.year}
          </p>

          {artwork.description && (
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              <span className="font-semibold">Description:</span> {artwork.description}
            </p>
          )}

          <div>
            <strong className="block text-purple-700 text-xl mb-3">Images:</strong>
            {images.length > 0 ? (
              <div className="flex space-x-4 overflow-x-auto pb-4">
                {images.map((Image_Url, i) => {
                  const src = Image_Url.startsWith('http')
                    ? Image_Url
                    : `http://localhost:5000/${Image_Url.replace(/^\/+/, '')}`;

                  return (
                    <div
                      key={i}
                      className="flex-shrink-0 w-64 h-44 rounded-xl overflow-hidden border border-gray-300 bg-gray-50 shadow-sm"
                    >
                      <img
                        src={src}
                        alt={`Artwork pic ${i + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No image available</p>
            )}
          </div>

          <div className="mt-6">
            <label htmlFor="rating" className="block font-medium text-gray-800 mb-2">
              Rating: <span className="text-purple-600 font-semibold">{rating} / 5</span>
            </label>

            <input
              id="rating"
              type="range"
              min="1"
              max="5"
              step="1"
              value={rating}
              onChange={handleRatingChange}
              className="w-full accent-purple-600"
            />

            <div className="flex justify-between text-sm mt-1 text-yellow-400 font-semibold select-none">
              {[1, 2, 3, 4, 5].map((value) => (
                <span key={value} className={value <= rating ? 'opacity-100' : 'opacity-40'}>
                  {'★'.repeat(value)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex space-x-4">
            {isPublic ? (
              <button
                onClick={() => navigate(`/artworks/${id}/comments`)}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Comments
              </button>
            ) : (
              <>
                <button
                  onClick={handleEdit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Edit
                </button>

                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        // EDIT FORM START
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-6">
          <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Edit Artwork</h2>
          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold text-purple-700">Title</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Title"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-purple-700">Artist</label>
              <input
                type="text"
                name="artist"
                value={form.artist}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Artist"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-purple-700">Genre</label>
              <Select
                options={genreOptions}
                onChange={handleGenreChange}
                value={genreOptions.find((opt) => opt.value === form.genre)}
                className="text-black"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-purple-700">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-semibold text-purple-700">Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Year"
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold text-purple-700">Rating</label>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer text-2xl transition-colors duration-200 ${
                        star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      onClick={() => setForm((prev) => ({ ...prev, rating: star }))}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold text-purple-700">Image</label>
              <input
                type="file"
                accept=".jpg,.png"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="bg-purple-500 hover:bg-purple-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
              >
                Update
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        // EDIT FORM END
      )}
    </div>
  );
};

export default ArtDetailsPage;
