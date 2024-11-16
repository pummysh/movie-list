import axios from "axios";

const API_KEY = process.env.REACT_APP_OMDB_API_KEY; // Ensure the API key is stored in your .env file
const BASE_URL = "https://www.omdbapi.com/";

const movieService = {
  /**
   * Fetches a list of movies based on a search term and page number.
   * @param {string} searchTerm - The title of the movie to search for.
   * @param {number} page - The page number for pagination.
   * @returns {Promise<object>} - An object containing the movies and additional metadata.
   */
  fetchMovies: async (searchTerm, page) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          s: searchTerm,
          page,
          apikey: API_KEY,
        },
      });

      if (response.data.Response === "True") {
        return {
          movies: response.data.Search,
          totalResults: parseInt(response.data.totalResults, 10),
        };
      } else {
        throw new Error(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching movies:", error.message);
      throw error; // Let the caller handle errors
    }
  },

  /**
   * Fetches detailed information for a specific movie by its IMDb ID.
   * @param {string} imdbID - The IMDb ID of the movie.
   * @returns {Promise<object>} - An object containing detailed movie information.
   */
  fetchMovieDetails: async (imdbID) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          i: imdbID,
          apikey: API_KEY,
        },
      });

      if (response.data.Response === "True") {
        return {
          title: response.data.Title,
          year: response.data.Year,
          genre: response.data.Genre,
          director: response.data.Director,
          plot: response.data.Plot,
          poster: response.data.Poster,
        };
      } else {
        throw new Error(response.data.Error);
      }
    } catch (error) {
      console.error("Error fetching movie details:", error.message);
      throw error; // Let the caller handle errors
    }
  },
};

export default movieService;
