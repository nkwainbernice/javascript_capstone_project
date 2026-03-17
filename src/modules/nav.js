// Function to create navbar
const createNavbar = () => {
  const { body } = document;

  // Navbar container
  const navbar = document.createElement('nav');
  navbar.classList.add('navbar');

  // App title
  const title = document.createElement('h1');
  title.textContent = 'Movie App';
  title.classList.add('navbar-title');

  // Search container
  const searchContainer = document.createElement('div');
  searchContainer.classList.add('search-container');

  // Search input
  const searchInput = document.createElement('input');
  searchInput.type = 'text';
  searchInput.placeholder = 'Search movies...';
  searchInput.classList.add('search-input');

  // Clock display
  const clock = document.createElement('div');
  clock.classList.add('clock');

  // Update clock every second
  const updateClock = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach((card) => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = title.includes(searchTerm) ? 'block' : 'none';
    });
  });

  // Append elements
  searchContainer.appendChild(searchInput);
  searchContainer.appendChild(clock);

  navbar.appendChild(title);
  navbar.appendChild(searchContainer);

  body.prepend(navbar);
};

export default createNavbar;