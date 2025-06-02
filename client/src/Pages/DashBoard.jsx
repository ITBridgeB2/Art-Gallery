import React from 'react';
import Navbar from '../Components/Navbar';
import GenreChart from '../Pages/Charts/GenrePopularChart';
import YearWiseChart from '../Pages/Charts/YearWiseChart';
import AgeGenreChart from './Charts/AgeWiseChart';


const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-4">
        <GenreChart />
        <YearWiseChart />
        <AgeGenreChart/>
      </div>
    </div>
  );
};

export default Dashboard;
