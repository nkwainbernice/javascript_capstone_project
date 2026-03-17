import { getStoredLikes, getStoredLiked } from './storage.js';
import { toggleLike, movieLikesState } from './like.js';

function displayMovies(movies, showPopup) {
  const movieContainer = document.getElementById('movies');
  if (!movieContainer) return;
  movieContainer.innerHTML = '';

  const movieCountElement = document.getElementById('movie_count');
  if (movieCountElement) movieCountElement.textContent = `Movies (${movies.length})`;

  const storedLikes = getStoredLikes();
  const storedLiked = getStoredLiked();

  movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie-card');

    const movieImage = document.createElement('img');
    movieImage.src = movie.image && movie.image.medium ? movie.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
    movieImage.alt = movie.name;

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.name;

    const buttonRow = document.createElement('div');
    buttonRow.classList.add('button-row');

    const likeButton = document.createElement('span');
    likeButton.classList.add('like-button');
    likeButton.textContent = '❤';

    const likeCounter = document.createElement('span');
    likeCounter.classList.add('like-counter');

    const commentButton = document.createElement('button');
    commentButton.classList.add('comment-button');
    commentButton.textContent = 'Comments';

    const savedCount = typeof storedLikes[movie.id] === 'number' ? storedLikes[movie.id] : 0;
    const savedLiked = Boolean(storedLiked[movie.id]);
    movieLikesState[movie.id] = { count: savedCount, isLiked: savedLiked };

    likeCounter.textContent = savedCount;
    if (savedLiked) likeButton.classList.add('liked');

    likeButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      const updatedLikes = await toggleLike(movie.id, storedLikes, storedLiked);
      likeCounter.textContent = updatedLikes;
      if (movieLikesState[movie.id]?.isLiked) {
        likeButton.classList.add('liked');
      } else {
        likeButton.classList.remove('liked');
      }
    });

    commentButton.addEventListener('click', async (e) => {
      e.stopPropagation();
      if (typeof showPopup === 'function') {
        await showPopup(movie);
      }
    });

    movieElement.appendChild(movieImage);
    buttonRow.appendChild(movieTitle);
    buttonRow.appendChild(likeButton);
    buttonRow.appendChild(likeCounter);
    movieElement.appendChild(buttonRow);
    movieElement.appendChild(commentButton);
    movieContainer.appendChild(movieElement);
  });
}
export default displayMovies;