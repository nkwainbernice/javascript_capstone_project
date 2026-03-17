const API_BASE = 'https://003-js-capstone-api.vercel.app';

const fetchMovies = async (displayMoviesCallback, showPopupCallback) => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    const data = await response.json();
    if (typeof displayMoviesCallback === 'function') {
      displayMoviesCallback(data, showPopupCallback);
    }
  } catch (error) {
    // Error fetching data; keep UI stable.
  }
};

const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
  return response.json();
};

const fetchLikes = async (movieId) => {
  const res = await fetch(`${API_BASE}/likes/${movieId}`);
  return res.json();
};
async function getLikes(movieId) {
      try {
        const res = await fetch(`https://003-js-capstone-api.vercel.app/likes/${movieId}`);
        const data = await res.json();

        if (data && typeof data.count === 'number') {
          return Math.max(0, data.count); // Ensure non-negative likes
        }
        return 0; // Default to 0 if no data found
      } catch (error) {
        // Error fetching likes; default to 0
        return 0;
      }
    }

export { fetchMovies, fetchMovieDetails, fetchLikes,getLikes };