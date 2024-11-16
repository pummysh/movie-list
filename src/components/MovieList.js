import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import MovieItem from "./MovieItem";
import movieService from "../services/movieService";
import "./MovieList.css"; // Add CSS for the list container

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset data when the search term changes
    setMovies([]);
    setPage(1);
    setHasMore(true);

    if (search.length >= 3) {
      fetchMovies(1); // Fetch the first page when the search changes
    }
  }, [search]);

  const fetchMovies = async (currentPage) => {
    setLoading(true);

    if (search.length < 3) {
      setLoading(false);
      return;
    }

    try {
      const { movies: newMovies, totalResults } =
        await movieService.fetchMovies(search, currentPage);

      // Append new movies to the existing list
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);

      // Update pagination state
      const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page
      if (currentPage >= totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      console.error("Error fetching movie list:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setError(null);
  };

  const loadMoreMovies = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  return (
    <div className="movie-list">
      <input
        type="text"
        placeholder="Search for movies..."
        value={search}
        onChange={handleSearch}
      />
      {loading && movies.length === 0 && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <InfiniteScroll
        dataLength={movies.length}
        next={loadMoreMovies}
        hasMore={hasMore}
        loader={
          <p>
            {search.length === 0
              ? "Enter at least 3 characters to search for movies"
              : "Loading more movies..."}
          </p>
        }
        endMessage={<p>No more movies to load.</p>}
      >
        {movies.map((movie) => (
          <MovieItem key={movie.imdbID} movie={movie} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default MovieList;
