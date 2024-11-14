import React, { useState } from "react";
import movieService from "../services/movieService";
import "./MovieItem.css"; // Adjust the import path as needed

const MovieItem = ({ movie }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleToggle = async () => {
    setIsOpen(!isOpen);

    if (details) return;

    setLoading(true);
    setError(null);

    try {
      const movieDetails = await movieService.fetchMovieDetails(movie.imdbID);
      setDetails(movieDetails);
    } catch (err) {
      setError("Failed to load movie details.");
      console.error("Error fetching movie details:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`movie-item ${isOpen ? "expanded" : ""}`}>
      <div className="movie-header" onClick={handleToggle}>
        <h3>{movie.Title}</h3>
        <span className={`arrow ${isOpen ? "open" : ""}`}>&#9660;</span>
      </div>

      {isOpen && (
        <div className="movie-details">
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && details && (
            <>
              <p>
                <strong>Year:</strong> {details.year || "N/A"}
              </p>
              <p>
                <strong>Genre:</strong> {details.genre || "N/A"}
              </p>
              <p>
                <strong>Director:</strong> {details.director || "N/A"}
              </p>
              <p>
                <strong>Plot:</strong> {details.plot || "N/A"}
              </p>
              {details.poster && (
                <img
                  src={details.poster}
                  alt={`${details.title} Poster`}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MovieItem;
