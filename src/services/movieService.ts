import axios from "axios";
import type { Movie } from "../types/movie";

interface MoviesHTTPResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesHTTPResponse> => {
  const response = await axios.get<MoviesHTTPResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
      },
    }
  );
  return response.data;
};
