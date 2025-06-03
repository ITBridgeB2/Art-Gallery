// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Masonry from "react-masonry-css";
// // import { motion } from "framer-motion";
// // import { Link } from "react-router-dom";
// // import toast from "react-hot-toast";

// // export default function ArtList() {
// //   const [artworks, setArtworks] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const fetchArtworks = async () => {
// //       try {
// //         const res = await axios.get("/api/artworks");
// //         setArtworks(res.data);
// //       } catch (err) {
// //         toast.error("Failed to load artworks");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchArtworks();
// //   }, []);

// //   const breakpointColumns = {
// //     default: 3,
// //     1024: 2,
// //     640: 1,
// //   };

// //   if (loading) {
// //     return <div className="text-center p-6">Loading artworks...</div>;
// //   }

// //   if (artworks.length === 0) {
// //     return (
// //       <div className="text-center p-6">
// //         <p>No artworks found.</p>
// //         <button
// //           onClick={() => window.location.reload()}
// //           className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
// //         >
// //           Retry
// //         </button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4">
// //       <Masonry
// //         breakpointCols={breakpointColumns}
// //         className="my-masonry-grid"
// //         columnClassName="my-masonry-grid_column"
// //       >
// //         {artworks.map((art) => (
// //           <Link to={`/artworks/${art.id}`} key={art.id}>
// //             <motion.div
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               transition={{ duration: 0.3 }}
// //               className="bg-white rounded-xl shadow-md p-4 mb-6 hover:shadow-lg transition-shadow"
// //             >
// //               <img
// //                 src={art.image_url || "/placeholder.png"}
// //                 alt={art.title}
// //                 className="w-full h-48 object-cover rounded mb-3"
// //               />
// //               <h3 className="text-xl font-semibold">{art.title}</h3>
// //               <p className="text-gray-600">{art.artist}</p>
// //               <p className="text-sm text-gray-400">{art.genre}</p>
// //               {art.is_popular && (
// //                 <span className="inline-block mt-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
// //                   Popular
// //                 </span>
// //               )}
// //             </motion.div>
// //           </Link>
// //         ))}
// //       </Masonry>
// //     </div>
// //   );
// // }










// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const ArtList = () => {
//   const [artworks, setArtworks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/artworks")
//       .then((res) => {
//         setArtworks(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         toast.error("Failed to load artworks");
//         console.error("Error:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div className="p-4">Loading...</div>;

//   return (
//     <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//       {artworks.length === 0 ? (
//         <p>No artworks found.</p>
//       ) : (
//         artworks.map((art) => (
//           <div key={art.id} className="border rounded-lg shadow p-4">
//             <img
//               src={art.image_url || "https://via.placeholder.com/300x200"}
//               alt={art.title}
//               className="w-full h-48 object-cover rounded mb-2"
//             />
//             <h2 className="text-xl font-semibold">{art.title}</h2>
//             <p className="text-sm text-gray-600">by {art.artist}</p>
//             <p className="text-sm italic">{art.genre}</p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default ArtList;




















import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ArtList = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/artworks")
      .then((res) => {
        setArtworks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load artworks");
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6 text-center text-purple-600 text-lg">Loading...</div>;

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {artworks.length === 0 ? (
        <p className="text-purple-600 text-center col-span-full">No artworks found.</p>
      ) : (
        artworks.map((art) => (
          <Link to={`/artworks/${art.id}`} key={art.id}>
            <div className="bg-white border border-purple-300 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 hover:bg-purple-50">



{/* ------------------ */}


              {/* <img
                src={`http://localhost:5000${art.image_url}` || "https://via.placeholder.com/300x200"}
                alt={art.title}
                className="w-full h-48 object-cover rounded-t-lg"
              /> */}

                {/* <img

  src={`http://localhost:5000${art.image_url}` || "https://via.placeholder.com/320x250"}
  alt={art.title}
  className="w-full h-48 object-cover rounded-md overflow-hidden"
/>
 */}

 {/* ------------------ */}
 

<div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
  <img
    src={`http://localhost:5000${art.image_url}` || "https://via.placeholder.com/300x200"}
    alt={art.title}
    className="max-h-full max-w-full object-contain"
  />
</div>


              <div className="p-4">
                <h2 className="text-xl font-bold text-purple-700 mb-1">{art.title}</h2>
                <p className="text-sm text-gray-700 mb-1">by <span className="font-medium">{art.artist}</span></p>
                <p className="text-sm italic text-purple-600">{art.genre}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default ArtList;
