import React, { useState, useEffect } from "react";
import MovieItem from "./MovieItem";
import movieService from "../services/movieService";
import "./MovieList.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);

    if (search.length >= 3) {
      fetchMovies(1);
    }
  }, [search]);

  useEffect(() => {
    if (page === 1) return;
    fetchMovies(page);
  }, [page]);

  const fetchMovies = async (currentPage) => {
    if (!hasMore) return;

    if (search.length < 3) {
      setLoading(false);
      return;
    }

    try {
      const { movies: newMovies, totalResults } =
        await movieService.fetchMovies(search, currentPage);

      // Append new movies to the existing list
      error && setError(null)
      setMovies((prevMovies) => [...prevMovies, ...newMovies]);

      // Update pagination state
      const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 results per page
      if (currentPage >= totalPages) {
        setHasMore(false);
      }
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
      // console.error("Error fetching movie list:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setError(null);
  };

  const handleScroll = () => {
    if (
      document.body.scrollHeight - 300 <
      window.scrollY + window.innerHeight
    ) {
      setLoading(true);
    }
  };

  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  window.addEventListener("scroll", debounce(handleScroll, 300));

  useEffect(() => {
    if (loading == true) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

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
      {movies.map((movie) => (
        <MovieItem key={movie.imdbID} movie={movie} />
      ))}
      {loading && hasMore && <p>Loading more movies...</p>}
      {!hasMore && <p>No more movies to load.</p>}
    </div>
  );
};

export default MovieList;
