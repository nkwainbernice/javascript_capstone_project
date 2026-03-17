
import {
  getStoredLikes, setStoredLikes, getStoredLiked, setStoredLiked,
} from '../storage.js';


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
    const count1 = await toggleLike(42, storedLikes, storedLiked, 'user_1');
    expect(count1).toBe(6);
    expect(storedLiked[42]).toBe(true);

    const count2 = await toggleLike(42, storedLikes, storedLiked, 'user_1');
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
});