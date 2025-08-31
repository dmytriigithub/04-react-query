import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie";

import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Modal from "../MovieModal/MovieModal";

import { useState } from "react";

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setIsModalOpen(false);
  };

  const handleSearch = async (query: string) => {
    try {
      setMovies([]);
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);

      if (!data.length) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(data);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onMovieClick={openModal} />
      )}
      {isModalOpen && selectedMovie && (
        <Modal onClose={closeModal} movie={selectedMovie} />
      )}
    </div>
  );
}

export default App;
