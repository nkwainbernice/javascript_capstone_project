import './style.css';


const fetchMovies = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    const data = await response.json();
    displayMovies(data);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
});
// Function to generate a unique user ID
const generateUserId = () => {
    return `user_${new Date().getTime()}`; // Simplified user ID
};

// Function to get the user ID from local storage or generate a new one
const getUserId = () => {
    let userId = localStorage.getItem("movieAppUserId");

    if (!userId) {
        userId = generateUserId();
        localStorage.setItem("movieAppUserId", userId);
    }

    return userId;
}

const userId = getUserId();
console.log("User ID:", userId);

 
 let popupOpen = false;
const displayMovies = (movies) => {
  const movieContainer = document.getElementById('movies');
  movieContainer.innerHTML = '';

  movies.forEach(movie => {
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

    // Fetch likes for the movie
    getLikes(movie.id).then(likes => {
      likeCounter.textContent = likes;
    });

    // Comment button
    const commentButton = document.createElement('button');
    commentButton.classList.add('comment-button');
    commentButton.textContent = 'Comments';
    commentButton.dataset.id = movie.id;

    // Movie counter
    const counter = document.getElementById('movie-count');
    if (counter) {
      counter.textContent = ` Movies (${movies.length})`;
    }

    movieElement.appendChild(movieImage);
    buttonContainer.appendChild(movieTitle);
    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(likeCounter);
    movieElement.appendChild(buttonContainer);
    movieElement.appendChild(commentButton);
    movieContainer.appendChild(movieElement);

    // Like button event listener
    likeButton.addEventListener('click', async (e) => {
      e.stopPropagation(); // Prevent event propagation
      await addLike(movie.id);
      const likes = await getLikes(movie.id);
      likeCounter.textContent = likes; // Update the likes count
    });
  });
};

// Event listener for comment button
document.getElementById('movies').addEventListener('click', async (e) => {
  if (e.target.classList.contains('comment-button')) {
  if (popupOpen) return; // stop double popup
    popupOpen = true;
    const movieId = e.target.dataset.id;
    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
      const movieData = await response.json();
      showPopup(movieData);
    } catch (error) {
      console.error("Error fetching single movie:", error);
    }
  }
});

// Get likes for the movie
async function getLikes(movieId) {
  try {
    const res = await fetch(`https://003-js-capstone-api.vercel.app/likes/${movieId}`);
    const data = await res.json();
    console.log(data); // Inspect this output
    
    // Assuming data is an object and not an array
    if (data && data.item_id === movieId.toString()) {
      return data.likes;
    }
    return 0; // Return 0 if no likes found for this movie
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
}

// Send likes to the API
async function addLike(movieId) {
    const userId = getUserId(); // Retrieve the user ID

    if (!userId) {
        console.error("User ID must be defined");
        return;
    }

    try {
        const likeUrl = `https://003-js-capstone-api.vercel.app/likes/`; 
        const bodyData = {
            user_id: userId,
            item_id: movieId
        };

        console.log("Payload data:", JSON.stringify(bodyData)); 

        const response = await fetch(likeUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        if (!response.ok) {
            const errorMessage = await response.text(); // Get error text from response
            throw new Error(`HTTP error! status: ${response.status} - ${errorMessage}`);
        }

        const result = await response.json();
        if (result.success) {
            console.log("Like added successfully:", result);
        } else {
            console.error("Failed to add like:", result);
        }

        return result;
    } catch (error) {
        console.error("Error adding like:", error);
    }
}



// Popup function

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
  commentTitle.textContent = "Comments (0)";

  const commentList = document.createElement('div');

  // FETCH COMMENTS
  
 // Fetch Comments
const appId = "https://003-js-capstone-api.vercel.app";

const getComments = async (movieId) => {
    if (!movieId) {
        console.error("No movie ID provided");
        return;
    }

    try {
        const res = await fetch(`${appId}/comments/${movieId}`);
        if (!res.ok) {
            throw new Error(`Network response was not ok: ${res.statusText}`);
        }

        const data = await res.json();

        commentList.innerHTML = ''; // Clear previous comments

        if (!Array.isArray(data)) {
            commentList.textContent = "No comments yet";
            return;
        }

        const movieComments = data.filter(comment => comment.item_id == movieId);

        commentTitle.textContent = `Comments (${movieComments.length})`;

        movieComments.forEach(comment => {
            const commentItem = document.createElement('p');
            commentItem.textContent = `${comment.creation_date} ${comment.username}: ${comment.comment}`;
            commentList.appendChild(commentItem);
        });

    } catch (error) {
        commentList.textContent = "Error loading comments, please try again later.";
        console.error("Error fetching comments:", error);
    }
};

// Example usage: Make sure to replace 'yourMovieId' with the actual movie ID you want to fetch comments for
const movieId = '<movie-id>'; // Replace with the actual movie ID
await getComments(movieId);

  // COMMENT FORM
  const formTitle = document.createElement('h3');
  formTitle.textContent = "Add a comment";

  const nameInput = document.createElement('input');
  nameInput.placeholder = "Your name";

  const commentInput = document.createElement('textarea');
  commentInput.placeholder = "Your comment";

  const submitBtn = document.createElement('button');
  submitBtn.textContent = "Comment";

submitBtn.addEventListener('click', async () => {
    const commentData = {
        item_id: movie.id,
        username: nameInput.value,
        comment: commentInput.value
    };

    try {
        await fetch(`${appId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(commentData)
        });
        nameInput.value = "";
        commentInput.value = "";
        await getComments(movie.id); // Refresh comments
    } catch (error) {
        console.error("Error submitting comment:", error);
    }
   getComments(); // refresh comments
});
   
 

  const closeBtn = document.createElement('button');
  closeBtn.textContent = "Close";

  closeBtn.addEventListener('click', () => {
    popup.style.display = "none";
      popupBody.innerHTML = "";
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
  

  popup.style.display = "flex";
};
       
       // Function to create navbar 
const createNavbar = () => {
  const body = document.body;

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
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const seconds = now.getSeconds().toString().padStart(2,'0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
  };
  setInterval(updateClock, 1000);
  updateClock();

  // Search functionality
  searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const movieCards = document.querySelectorAll('.movie-card');

    movieCards.forEach(card => {
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

 //copyright function
 const addCopyright = () =>{
   const footer = document.createElement('footer');
   footer.innerHTML = `@ ${new Date().getFullYear()}Nkwain Bernice|Ngnayou Fabiola| Movie App`;
   document.body.appendChild(footer);
 }
  addCopyright();
