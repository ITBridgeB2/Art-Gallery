import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import FocusTrap from 'focus-trap-react';
import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();
const genres = ['Painting', 'Sculpture', 'Photography', 'Other'];

const validateField = (name, value) => {
  switch (name) {
    case 'title':
    case 'artist':
    case 'genre':
      if (!value?.trim()) return `${name[0].toUpperCase() + name.slice(1)} is required`;
      break;
    case 'year':
      if (!value?.trim()) return 'Year is required';
      if (!/^\d{4}$/.test(value.trim())) return 'Year must be 4 digits';
      if (+value < 1000 || +value > currentYear) return `Year must be between 1000 and ${currentYear}`;
      break;
    case 'image':
      if (!value) return 'Image is required';
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(value.type)) return 'Image must be JPEG, PNG, or GIF';
      if (value.size > 5 * 1024 * 1024) return 'Image must be under 5MB';
      break;
    default:
      break;
  }
};

export default function AddArtPage({ isOpen, onClose }) {
  const [form, setForm] = useState({
    title: '', artist: '', genre: '', year: '', rating: 3, description: '', image: null,
  });
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const escHandler = (e) => e.key === 'Escape' && isOpen && onClose();
    window.addEventListener('keydown', escHandler);
    return () => window.removeEventListener('keydown', escHandler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!form.image) return setPreview(null);
    const url = URL.createObjectURL(form.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [form.image]);

  const validate = (data) => ['title', 'artist', 'genre', 'year', 'image']
    .reduce((acc, f) => {
      const val = f === 'image' ? data.image : data[f];
      const err = validateField(f, val);
      if (err) acc[f] = err;
      return acc;
    }, {});

  const handleChange = ({ target }) => {
    const { name, value, type, files } = target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'file' ? files[0] : value,
    }));
    if (type === 'file') setErrors(prev => ({ ...prev, image: null }));
  };

  const handleBlur = ({ target }) => {
    const val = target.name === 'image' ? target.files[0] : target.value;
    setErrors(prev => ({ ...prev, [target.name]: validateField(target.name, val) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    if (Object.keys(validation).length) return setErrors(validation);

    try {
      setUploading(true);
      const imageData = new FormData();
      imageData.append('file', form.image);

      const { data: uploadData } = await axios.post('http://localhost:5000/api/upload', imageData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (!uploadData?.imageUrl) throw new Error('Image upload failed');

      await axios.post('http://localhost:5000/api/artworks', {
        title: form.title,
        artist: form.artist,
        genre: form.genre,
        year: form.year,
        rating: form.rating,
        description: form.description,
        image_url: uploadData.imageUrl,
      });

      toast.success('Artwork added!');
      setForm({ title: '', artist: '', genre: '', year: '', rating: 3, description: '', image: null });
      setErrors({});
      setPreview(null);
      onClose();
      setTimeout(() => navigate('/'), 1000);
    } catch {
      toast.error('Failed to add artwork.');
    } finally {
      setUploading(false);
    }
  };

  const hasErrors = Object.values(errors).some(Boolean);
  const isFormIncomplete = !form.title.trim() || !form.artist.trim() || !form.genre.trim() || !form.year.trim() || !form.image;

  return (
    <>
      <Toaster position="top-right" />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <FocusTrap active={isOpen}>
              <motion.div
                className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl ring-1 ring-black ring-opacity-5
                  focus:outline-none sm:p-10 overflow-y-auto max-h-[90vh]"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onClick={e => e.stopPropagation()}
              >
                <h2 className="text-2xl font-extrabold text-indigo-700 mb-6">Add New Artwork</h2>
                <form onSubmit={handleSubmit} noValidate>
                  {['title', 'artist', 'year'].map(field => (
                    <div key={field} className="mb-5">
                      <input
                        type="text"
                        name={field}
                        placeholder={field[0].toUpperCase() + field.slice(1)}
                        value={form[field]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full rounded-lg border px-4 py-3 text-lg shadow-sm
                          focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                          ${errors[field] ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                      />
                      {errors[field] && <p className="text-red-600 text-sm mt-1">{errors[field]}</p>}
                    </div>
                  ))}

                  <div className="mb-5">
                    <select
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full rounded-lg border px-4 py-3 text-lg shadow-sm
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition
                        ${errors.genre ? 'border-red-500 ring-red-500' : 'border-gray-300'}`}
                    >
                      <option value="">Select Genre</option>
                      {genres.map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {errors.genre && <p className="text-red-600 text-sm mt-1">{errors.genre}</p>}
                  </div>

                  <div className="mb-6">
                    <textarea
                      name="description"
                      placeholder="Description (optional)"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg shadow-sm resize-none
                        focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      rows="4"
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="image" className="block mb-2 font-semibold text-gray-700">Upload Image</label>
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0 file:text-sm file:font-semibold
                        file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                    />
                    {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                    {preview && (
                      <div className="mt-4 rounded-lg overflow-hidden shadow-lg border max-w-xs">
                        <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label htmlFor="rating" className="block font-medium text-gray-800 mb-2">
                      Rating: <span className="text-purple-600 font-semibold">{form.rating} / 5</span>
                    </label>
                    <input
                      id="rating"
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={form.rating}
                      onChange={e => setForm(prev => ({ ...prev, rating: +e.target.value }))}
                      className="w-full accent-purple-600"
                    />
                    <div className="flex justify-between text-sm mt-1 text-yellow-400 font-semibold select-none">
                      {[1, 2, 3, 4, 5].map(v => (
                        <span key={v} className={v <= form.rating ? 'opacity-100' : 'opacity-40'}>
                          {'★'.repeat(v)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => { setForm({ title: '', artist: '', genre: '', year: '', rating: 3, description: '', image: null }); setErrors({}); setPreview(null); onClose(); }}
                      className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                      disabled={uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading || hasErrors || isFormIncomplete}
                      className={`px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold
                        hover:bg-indigo-700 transition ${uploading || hasErrors || isFormIncomplete ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? 'Uploading...' : 'Add Artwork'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </FocusTrap>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
