import './style.css';
import createNavbar from './modules/nav.js'; // Default import
import addCopyright from './modules/copyright.js'; // Default import
import displayMovies from './modules/displayMovies.js'; // Default import
import showPopup from './modules/popup.js'; // Default import
import { fetchMovies } from './modules/movieApi.js';

// Initialize navbar
createNavbar();

// Initialize copyright
addCopyright();

// Load movies on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await fetchMovies(displayMovies, showPopup);
});
