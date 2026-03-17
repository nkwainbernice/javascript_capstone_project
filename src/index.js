import './style.css';
import { displayMovies } from './modules/displayMovies.js';
import { fetchMovies } from './modules/movieApi.js';
import { createNavbar } from './modules/nav.js';
import { addCopyright } from './modules/copyright.js';
import { showPopup } from './modules/popup.js';

// Initialize navbar
createNavbar();

// Initialize copyright
addCopyright();

// Load movies on DOM ready
document.addEventListener('DOMContentLoaded', async () => {
  await fetchMovies(displayMovies, showPopup);
});

