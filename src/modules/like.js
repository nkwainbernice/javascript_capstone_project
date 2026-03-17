import { setStoredLikes, setStoredLiked } from './storage.js';

const movieLikesState = {};

const toggleLike = async (movieId, storedLikes, storedLiked) => {
  if (!movieLikesState[movieId]) {
    movieLikesState[movieId] = { count: 0, isLiked: false };
  }

  const likedData = movieLikesState[movieId];

  if (likedData.isLiked) {
    likedData.count = Math.max(0, likedData.count - 1);
    likedData.isLiked = false;
    delete storedLiked[movieId];
  } else {
    likedData.count += 1;
    likedData.isLiked = true;
    storedLiked[movieId] = true;
  }

  storedLikes[movieId] = likedData.count;

  setStoredLikes(storedLikes);
  setStoredLiked(storedLiked);

  return likedData.count;
};

export { toggleLike, movieLikesState };