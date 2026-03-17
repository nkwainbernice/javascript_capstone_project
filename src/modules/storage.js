const getStoredLikes = () => {
  try {
    return JSON.parse(localStorage.getItem('movieLikes')) || {};
  } catch {
    return {};
  }
};

const setStoredLikes = (likes) => {
  localStorage.setItem('movieLikes', JSON.stringify(likes));
};

const getStoredLiked = () => {
  try {
    return JSON.parse(localStorage.getItem('movieLiked')) || {};
  } catch {
    return {};
  }
};

const setStoredLiked = (liked) => {
  localStorage.setItem('movieLiked', JSON.stringify(liked));
};

const storedLikes = getStoredLikes();
const storedLiked = getStoredLiked();

export {
  getStoredLikes,
  setStoredLikes,
  getStoredLiked,
  setStoredLiked,
};