import './style.css';

// Function to generate a unique user ID
const generateUserId = () => `user_${new Date().getTime()}`; // Simplified user ID;

// Function to get the user ID from local storage or generate a new one
const getUserId = () => {
  let userId = localStorage.getItem('movieAppUserId');

  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('movieAppUserId', userId);
  }

  return userId;
};

const userId = getUserId();

const getStoredLikes = () => {
  try {
    return JSON.parse(localStorage.getItem('movieLikes')) || {};
  } catch (error) {
    return {};
  }
};

const setStoredLikes = (likes) => {
  localStorage.setItem('movieLikes', JSON.stringify(likes));
};

const getStoredLiked = () => {
  try {
    return JSON.parse(localStorage.getItem('movieLiked')) || {};
  } catch (error) {
    return {};
  }
};

const setStoredLiked = (liked) => {
  localStorage.setItem('movieLiked', JSON.stringify(liked));
};

const storedLikes = getStoredLikes();
const storedLiked = getStoredLiked();

let popupOpen = false;
const movieLikesState = {}; // Object to store like states for each movie

function displayMovies(movies) {
  const movieContainer = document.getElementById('movies');
  movieContainer.innerHTML = '';

  // movie counter
  const counter = document.getElementById('movie_count');
  if (counter) {
    counter.textContent = `movies(${movies.length})`;
  }

  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-card');

    const movieImage = document.createElement('img');
    movieImage.src = movie.image && movie.image.medium ? movie.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';

    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.name;

    // Like button
    const likeButton = document.createElement('span');
    likeButton.innerHTML = '&#10084;'; // Heart symbol
    likeButton.classList.add('like-button');

    const likeCounter = document.createElement('span');
    likeCounter.classList.add('like-counter');

    // Initialize like state for the movie from local storage
    const savedCount = typeof storedLikes[movie.id] === 'number' ? storedLikes[movie.id] : 0;
    const savedLiked = Boolean(storedLiked[movie.id]);
    movieLikesState[movie.id] = { isLiked: savedLiked, count: savedCount };
    likeCounter.textContent = savedCount;
    if (savedLiked) {
      likeButton.classList.add('liked');
    }

    // Get likes for the movie
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

    // Send likes to the API and persist locally
    async function toggleLike(movieId) {
      const likedData = movieLikesState[movieId];
      if (!likedData) return 0;

      if (likedData.isLiked) {
        // Unlike logic (local toggle)
        likedData.count = Math.max(0, likedData.count - 1);
        likedData.isLiked = false;
        delete storedLiked[movieId];
      } else {
        // Like logic
        likedData.count += 1;
        likedData.isLiked = true;
        storedLiked[movieId] = true;

        // Optional remote update (API may fail, local state still persists)
        try {
          const likeUrl = 'https://003-js-capstone-api.vercel.app/likes/';
          const bodyData = { movieId: movieId.toString(), userId };
          await fetch(likeUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData),
          });
        } catch (error) {
          // Non-fatal like post error
        }
      }

      storedLikes[movieId] = likedData.count;
      setStoredLikes(storedLikes);
      setStoredLiked(storedLiked);

      return likedData.count;
    }

    // Fetch likes from API to keep remote state in sync (optional)
    getLikes(movie.id).then((likes) => {
      if (typeof likes === 'number' && likes > movieLikesState[movie.id].count) {
        movieLikesState[movie.id].count = likes;
        likeCounter.textContent = likes;
        storedLikes[movie.id] = likes;
        setStoredLikes(storedLikes);
      }
    });
    // Like button event listener
    likeButton.addEventListener('click', async (e) => {
      e.stopPropagation(); // Prevent event propagation
      const updatedCount = await toggleLike(movie.id);
      likeCounter.textContent = updatedCount;
      if (movieLikesState[movie.id].isLiked) {
        likeButton.classList.add('liked');
      } else {
        likeButton.classList.remove('liked');
      }
    });

    // Comment button
    const commentButton = document.createElement('button');
    commentButton.classList.add('comment-button');
    commentButton.textContent = 'Comments';
    commentButton.dataset.id = movie.id;

    movieElement.appendChild(movieImage);
    buttonContainer.appendChild(movieTitle);
    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(likeCounter);
    movieElement.appendChild(buttonContainer);
    movieElement.appendChild(commentButton);
    movieContainer.appendChild(movieElement);
  });
}

const fetchMovies = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    const data = await response.json();
    displayMovies(data);
  } catch (error) {
    // Error fetching data; keep UI stable.
  }
};

const showPopup = async (movie) => {
  const popup = document.getElementById('popup');
  const popupBody = document.getElementById('popup-body');
  popupBody.innerHTML = '';

  const image = document.createElement('img');
  image.src = movie.image ? movie.image.original : '';
  image.style.width = '100%';

  const title = document.createElement('h2');
  title.textContent = movie.name;

  const language = document.createElement('p');
  language.textContent = `Language: ${movie.language}`;

  const genres = document.createElement('p');
  genres.textContent = `Genres: ${movie.genres.join(', ')}`;

  const description = document.createElement('p');
  description.innerHTML = movie.summary;

  // COMMENTS TITLE
  const commentTitle = document.createElement('h3');
  commentTitle.textContent = 'Comments (0)';

  const commentList = document.createElement('div');

  // COMMENT FORM
  const formTitle = document.createElement('h3');
  formTitle.textContent = 'Add a comment';

  const nameInput = document.createElement('input');
  nameInput.placeholder = 'Your name';

  const commentInput = document.createElement('textarea');
  commentInput.placeholder = 'Your comment';

  const submitBtn = document.createElement('button');
  submitBtn.textContent = 'Comment';

  // FETCH COMMENTS

  const appId = 'https://003-js-capstone-api.vercel.app';

  const getComments = async (movieId) => {
    try {
      const res = await fetch(`${appId}/comments/${movieId}`);
      const data = await res.json();

      commentList.innerHTML = '';

      // Handle API response structure: {success: true, comments: Array}
      const commentsArray = data.comments || (Array.isArray(data) ? data : []);

      if (!Array.isArray(commentsArray) || commentsArray.length === 0) {
        commentTitle.textContent = 'Comments (0)';
        commentList.textContent = 'No comments yet';
        return;
      }

      commentTitle.textContent = `Comments (${commentsArray.length})`;

      commentsArray.forEach((comment) => {
        const commentItem = document.createElement('p');

        // Handle both 'userName' and 'username' field names (case-insensitive)
        const username = comment.userName || comment.username || 'Anonymous';
        const date = comment.creation_date || comment.createdAt || '';
        const commentText = comment.comment || comment.commentText || '';

        commentItem.textContent = `${date} ${username}: ${commentText}`.trim();

        commentList.appendChild(commentItem);
      });
    } catch (error) {
      commentList.textContent = 'Error loading comments.';
    }
  };

  await getComments(movie.id);
  submitBtn.addEventListener('click', async () => {
    const username = nameInput.value.trim();
    const commentText = commentInput.value.trim();
    const userId = getUserId();

    // Input validation
    if (!username || !commentText || !movie.id || !userId) {
      // show inline validation message instead of alert
      commentList.textContent = 'Please fill all fields';
      return;
    }

    const commentData = {
      movieId: movie.id.toString(), // Convert to string if the API expects it
      userName: username,
      comment: commentText,
      userId,
    };

    // Submitting comment data for movieId:
    try {
      const response = await fetch(`${appId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      if (!response.ok) {
        let errorMsg = `Failed to post comment: ${response.status}`;
        if (response.status === 500) {
          errorMsg += ' - Server error. Please try again later.';
        } else if (response.status >= 400 && response.status < 500) {
          errorMsg += ' - Request error. Check your input.';
        }
        throw new Error(errorMsg);
      }

      // Clear input fields after success
      nameInput.value = '';
      commentInput.value = '';

      commentList.textContent = 'Comment submitted successfully!';

      // Add a small delay to ensure backend processes the comment
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Fetch and update comments after successful submission
      await getComments(movie.id);
    } catch (error) {
      commentList.textContent = `Error submitting comment: ${error.message || 'unknown error'}`;
    }
  });

  const closeBtn = document.createElement('button');
  closeBtn.textContent = 'Close';

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    popupBody.innerHTML = '';
    popupOpen = false; // allow popup again
  });

  popupBody.appendChild(image);
  popupBody.appendChild(title);
  popupBody.appendChild(language);
  popupBody.appendChild(genres);
  popupBody.appendChild(description);
  popupBody.appendChild(commentTitle);
  popupBody.appendChild(commentList);
  popupBody.appendChild(formTitle);
  popupBody.appendChild(nameInput);
  popupBody.appendChild(commentInput);
  popupBody.appendChild(submitBtn);
  popupBody.appendChild(closeBtn);

  popup.style.display = 'flex';
};

// Event listener for comment button
document.getElementById('movies').addEventListener('click', async (e) => {
  if (e.target.classList.contains('comment-button')) {
    if (popupOpen) return; // Stop double popup
    popupOpen = true;
    const movieId = e.target.dataset.id;
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
      const movieData = await response.json();
      showPopup(movieData);
    } catch (error) {
      // Error fetching movie; keep UI stable
    }
  }
});

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

// Initialize navbar
createNavbar();

// copyright function
const addCopyright = () => {
  const footer = document.createElement('footer');
  footer.innerHTML = `@ ${new Date().getFullYear()}Nkwain Bernice|Ngnayou Fabiola| Movie App`;
  document.body.appendChild(footer);
};
addCopyright();

document.addEventListener('DOMContentLoaded', () => {
  fetchMovies();
});
