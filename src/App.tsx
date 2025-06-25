import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../src/stores/store"; // ← cesta k tvému store.ts

import HomePage from "./screens/homepage";
import MyWatchlists from "./screens/MyWatchLists";
import CreatePlaylist from "./screens/CreatePlaylist";
import PlaylistPage from "./screens/PlaylistPage";
import Footer from "./components/Footer";
import ActorPage from "./screens/ActorsPage";
import MoviePage from "./screens/MoviePage";
import Navbar from "./components/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:imdbID" element={<MoviePage />} />
          <Route path="/watchlists" element={<MyWatchlists />} />
          <Route path="/create-playlist" element={<CreatePlaylist />} />
          <Route path="/playlist/:id" element={<PlaylistPage />} />
          <Route path="/person/:id" element={<ActorPage />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
