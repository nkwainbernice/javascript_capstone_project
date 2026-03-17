import {
  getStoredLikes, setStoredLikes, getStoredLiked, setStoredLiked,
} from '../storage.js';
import getUserId from '../userId.js';
import { toggleLike, movieLikesState } from '../like.js';
import displayMovies from '../displayMovies.js';
import { getComments, addComment } from '../commentApi.js';
import {
  fetchMovies, fetchMovieDetails, fetchLikes, getLikes,
} from '../movieApi.js';

describe('userId module', () => {
  it('returns the same userId when called repeatedly', () => {
    const id1 = getUserId();
    const id2 = getUserId();
    expect(id1).toBe(id2);
    expect(id1).toMatch(/^user_\d+$/);
  });
});

describe('storage module', () => {
  it('stores and retrieves likes and liked flags', () => {
    const likes = { 1: 2 };
    const liked = { 1: true };

    setStoredLikes(likes);
    setStoredLiked(liked);

    expect(getStoredLikes()).toEqual(likes);
    expect(getStoredLiked()).toEqual(liked);
  });
});

describe('like module', () => {
  it('increments and decrements movie likes', async () => {
    const storedLikes = { 42: 5 };
    const storedLiked = { 42: false };
    movieLikesState[42] = { count: 5, isLiked: false };

    const count1 = await toggleLike(42, storedLikes, storedLiked);
    expect(count1).toBe(6);
    expect(storedLiked[42]).toBe(true);

    const count2 = await toggleLike(42, storedLikes, storedLiked);
    expect(count2).toBe(5);
    expect(storedLiked[42]).toBeUndefined();
  });
});

describe('displayMovies', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="movie_count"></div>
      <div id="movies"></div>
    `;
    setStoredLikes({}); // Clear storage before each test
  });

  test('should render movie cards', () => {
    const movies = [{ id: 1, name: 'Batman', image: { medium: 'batman.jpg' } }];
    displayMovies(movies, () => {});

    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(1);
  });

  test('renders movie counter, buttons exist, and clicking comment calls popup', async () => {
    const movies = [{ id: 1, name: 'Batman', image: { medium: 'batman.jpg' } }];
    const showPopup = jest.fn();

    displayMovies(movies, showPopup);

    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (1)');

    const commentButton = document.querySelector('.comment-button');
    const likeButton = document.querySelector('.like-button');
    expect(commentButton).not.toBeNull();
    expect(likeButton).not.toBeNull();

    commentButton.click();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(showPopup).toHaveBeenCalledWith(movies[0]);
  });

  test('displays correct movie count for multiple movies', () => {
    const movies = [
      { id: 1, name: 'Batman', image: { medium: 'batman.jpg' } },
      { id: 2, name: 'Superman', image: { medium: 'superman.jpg' } },
      { id: 3, name: 'Wonder Woman', image: { medium: 'wonderwoman.jpg' } },
    ];
    displayMovies(movies, () => {});

    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (3)');

    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(3);
  });

  test('handles empty movie list', () => {
    displayMovies([], () => {});

    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (0)');
    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(0);
  });

  test('handles missing movie image', () => {
    displayMovies([{ id: 1, name: 'Batman' }], () => {});

    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (1)');

    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(1);
  });

  test('handles missing movie name', () => {
    displayMovies([{ id: 1, image: { medium: 'batman.jpg' } }], () => {});
    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (1)');
    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(1);
  });

  test('handles missing movie id', () => {
    displayMovies([{ name: 'Batman', image: { medium: 'batman.jpg' } }], () => {});
    const counter = document.getElementById('movie_count');
    expect(counter.textContent).toBe('Movies (1)');
    const cards = document.querySelectorAll('.movie-card');
    expect(cards.length).toBe(1);
  });

  test('should show zero likes for new movies', () => {
    const movies = [{ id: 1, name: 'Batman', image: { medium: 'batman.jpg' } }];
    displayMovies(movies, () => {});
    const likeCounter = document.querySelector('.like-counter');
    expect(likeCounter.textContent).toBe('0');
  });

  test('should update like count when like button is clicked', async () => {
    const movies = [{ id: 1, name: 'Batman', image: { medium: 'batman.jpg' } }];
    displayMovies(movies, () => {});
    const likeButton = document.querySelector('.like-button');
    const likeCounter = document.querySelector('.like-counter');
    expect(likeCounter.textContent).toBe('0');
    likeButton.click();
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
    expect(likeCounter.textContent).toBe('1');
  });
});

describe('commentApi module', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('getComments fetches comments successfully', async () => {
    const mockComments = [
      { username: 'user1', comment: 'Great movie!' },
      { username: 'user2', comment: 'Awesome!' },
    ];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ comments: mockComments }),
    });

    const comments = await getComments(1);
    expect(fetch).toHaveBeenCalledWith('https://003-js-capstone-api.vercel.app/comments/1');
    expect(comments).toEqual(mockComments);
  });

  test('getComments returns empty array on error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const comments = await getComments(1);
    expect(comments).toEqual([]);
  });

  test('addComment posts comment successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      status: 201,
    });

    const result = await addComment(1, 'testuser', 'Nice movie!', 'user123');
    expect(fetch).toHaveBeenCalledWith('https://003-js-capstone-api.vercel.app/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: '1',
        userName: 'testuser',
        comment: 'Nice movie!',
        userId: 'user123',
      }),
    });
    expect(result).toBe(true);
  });

  test('addComment returns false on failure', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const result = await addComment(1, 'testuser', 'Nice movie!', 'user123');
    expect(result).toBe(false);
  });

  test('addComment returns false on network error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await addComment(1, 'testuser', 'Nice movie!', 'user123');
    expect(result).toBe(false);
  });
});

describe('movieApi module', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test('fetchMovies calls displayMoviesCallback with data', async () => {
    const mockMovies = [{ id: 1, name: 'Test Movie' }];
    const displayMoviesCallback = jest.fn();
    const showPopupCallback = jest.fn();

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockMovies),
    });

    await fetchMovies(displayMoviesCallback, showPopupCallback);

    expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows');
    expect(displayMoviesCallback).toHaveBeenCalledWith(mockMovies, showPopupCallback);
  });

  test('fetchMovies handles fetch error gracefully', async () => {
    const displayMoviesCallback = jest.fn();
    const showPopupCallback = jest.fn();

    fetch.mockRejectedValueOnce(new Error('Network error'));

    await fetchMovies(displayMoviesCallback, showPopupCallback);

    expect(displayMoviesCallback).not.toHaveBeenCalled();
  });

  test('fetchMovieDetails returns movie data', async () => {
    const mockMovie = { id: 1, name: 'Test Movie' };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockMovie),
    });

    const result = await fetchMovieDetails(1);

    expect(fetch).toHaveBeenCalledWith('https://api.tvmaze.com/shows/1');
    expect(result).toEqual(mockMovie);
  });

  test('fetchLikes returns likes data', async () => {
    const mockLikes = { count: 5 };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockLikes),
    });

    const result = await fetchLikes(1);

    expect(fetch).toHaveBeenCalledWith('https://003-js-capstone-api.vercel.app/likes/1');
    expect(result).toEqual(mockLikes);
  });

  test('getLikes returns count successfully', async () => {
    const mockData = { count: 10 };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getLikes(1);

    expect(fetch).toHaveBeenCalledWith('https://003-js-capstone-api.vercel.app/likes/1');
    expect(result).toBe(10);
  });

  test('getLikes returns 0 on error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    const result = await getLikes(1);

    expect(result).toBe(0);
  });

  test('getLikes returns 0 when no count', async () => {
    const mockData = {};

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getLikes(1);

    expect(result).toBe(0);
  });
});
