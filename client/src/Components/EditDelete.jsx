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

const EditDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/artworks/${id}`)
      .then((res) => {
        const data = res.data;
        setForm({
          ...data,
          year: data.year || '',
          description: data.description || '',
          rating: data.rating || 0,
          imageFile: null,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error('Artwork not found');
        navigate('/');
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (selected) => {
    setForm((prev) => ({ ...prev, genre: selected?.value || '' }));
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, imageFile: e.target.files[0] }));
  };

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
      navigate(`/artwork/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this artwork?')) return;
    try {
      await axios.delete(`http://localhost:5000/artworks/${id}`);
      toast.success('Artwork deleted');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server error');
    }
  };

  if (loading) return <div className="text-center py-8 text-lg text-purple-600">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <Toaster />
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
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition duration-200"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditDelete;