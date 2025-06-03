import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

import Navbar from '../Components/Navbar';
import ArtList from '../Components/ArtList';
import AddArtPage from '../Components/AddArt';
import ArtFilter from '../Components/Filter';
import SearchArtworks from '../Components/Search';
import SortArtworks from '../Components/Sort';

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAddArtOpen, setAddArtOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/artworks')
      .then((res) => {
        setArtworks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to load artworks');
        console.error('Error:', err);
        setLoading(false);
      });
  }, []);

  const openAddArtModal = () => setAddArtOpen(true);
  const closeAddArtModal = () => setAddArtOpen(false);

  // Filter and search logic
  const filteredArtworks = artworks.filter((art) => {
    // Filter by style (genre)
    if (selectedStyle !== 'All' && art.genre !== selectedStyle) return false;

    // Search by title or artist (case insensitive)
    const lowerSearch = searchTerm.toLowerCase();
    if (
      !art.title.toLowerCase().includes(lowerSearch) &&
      !art.artist.toLowerCase().includes(lowerSearch)
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onAddArtClick={openAddArtModal} />

      <main className="max-w-7xl mx-auto px-4 py-10">
       

        {/* Add filter and search components */}
    <main className="max-w-7xl mx-auto px-4 py-10">
  <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 px-4 relative">
    <div className="w-full md:w-1/2 lg:w-2/5 relative">
      <SearchArtworks
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        artworks={artworks}
      />
    </div>
    <div className="w-full md:w-1/4 lg:w-1/5">
      <ArtFilter selectedStyle={selectedStyle} onChange={setSelectedStyle} />
    </div>
    <div className="w-full md:w-1/4 lg:w-1/5">
      <SortArtworks selectedSort={selectedSort} onChange={setSelectedSort} />
    </div>
  </div>

  <ArtList artworks={filteredArtworks} loading={loading} selectedSort={selectedSort} />
</main>


        {/* Pass filtered artworks & loading to ArtList */}
        <ArtList artworks={filteredArtworks} loading={loading} />
      </main>

      <AddArtPage isOpen={isAddArtOpen} onClose={closeAddArtModal} />
    </div>
  );
};

export default Home;
