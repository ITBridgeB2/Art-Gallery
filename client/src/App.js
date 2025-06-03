import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ArtList from "./Components/ArtList";
import ArtDetailsPage from "./Pages/ArtDetailsPage";
import EditDelete from "./Components/EditDelete";

function App() {
  return (
    <Router>
      <Toaster />
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center mb-6">Art Gallery</h1>
        <Routes>
          <Route path="/" element={<ArtList />} />
          <Route path="/artworks/:id" element={<ArtDetailsPage />} />
          <Route path="/artworks/edit/:id" element={<EditDelete />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
