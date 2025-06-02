import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YearWiseChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics/year-wise')
      .then(res => {
        const raw = res.data;
        const grouped = {};

        raw.forEach(({ year, genre, count }) => {
          if (!grouped[year]) grouped[year] = { year };
          grouped[year][genre] = count;
        });

        setData(Object.values(grouped));
      })
      .catch(err => console.error(err));
  }, []);

  const allGenres = Array.from(
    new Set(data.flatMap(item => Object.keys(item)).filter(k => k !== 'year'))
  );

  const colors = ['#8b5cf6', '#14b8a6', '#f59e0b', '#ef4444', '#3b82f6', '#10b981'];

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">📅 Year-wise Genre Popularity</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          {allGenres.map((genre, index) => (
            <Bar key={genre} dataKey={genre} fill={colors[index % colors.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearWiseChart;
