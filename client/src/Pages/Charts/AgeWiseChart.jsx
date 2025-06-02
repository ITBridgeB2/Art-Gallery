import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AgeGenreChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/analytics/age-genre')
      .then(res => {
        const raw = res.data;
        const grouped = {};

        raw.forEach(({ age, genre, count }) => {
          if (!grouped[age]) grouped[age] = { age };
          grouped[age][genre] = count;
        });

        setData(Object.values(grouped));
      })
      .catch(err => console.error(err));
  }, []);

  const allGenres = Array.from(
    new Set(data.flatMap(d => Object.keys(d)).filter(k => k !== 'age'))
  );

  const colors = ['#f97316', '#6366f1', '#22c55e', '#eab308', '#ec4899', '#0ea5e9'];

  return (
    <div className="bg-white shadow-md rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">👥 Age-wise Genre Popularity</h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="age" />
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

export default AgeGenreChart;
