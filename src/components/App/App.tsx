import css from "./App.module.css";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

import type { Movie } from "../../types/movie";
import { fetchMovies } from "../../services/movieService";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (isSuccess && data && data.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [isSuccess, data]);

  const totalPages = data?.total_pages ?? 0;

  const openModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && data?.total_pages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid movies={data.results} onSelect={openModal} />
      )}
      {selectedMovie && (
        <MovieModal onClose={closeModal} movie={selectedMovie} />
      )}
    </div>
  );
}

export default App;
