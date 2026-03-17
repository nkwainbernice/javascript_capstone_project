// comments.js

const appId = 'https://003-js-capstone-api.vercel.app';

// Fetch comments for a specific movie
const getComments = async (movieId) => {
  try {
    const res = await fetch(`${appId}/comments/${movieId}`);
    const data = await res.json();

    return data.comments || []; // Return comments or an empty array if not found
  } catch (error) {
    // Error fetching comments; return empty list
    return []; // Return an empty array in case of error
  }
};

// Add a comment for a specific movie
const addComment = async (movieId, username, comment, userId) => {
  const commentData = {
    movieId: movieId.toString(),
    userName: username,
    comment,
    userId,
  };

  try {
    const response = await fetch(`${appId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error(`Failed to post comment: ${response.status}`);
    }

    return true; // Successfully added comment
  } catch (error) {
    // Error submitting comment; return false to indicate failure
    return false; // Return false in case of error
  }
};

export { getComments, addComment };