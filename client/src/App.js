import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ArtList from "./Components/ArtList";
import ArtDetailsPage from "./Pages/ArtDetailsPage";

function App() {
  return (
    <Router>
      <Toaster />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Art Gallery</h1>
        <Routes>
          <Route path="/" element={<ArtList />} />
          <Route path="/artworks/:id" element={<ArtDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
