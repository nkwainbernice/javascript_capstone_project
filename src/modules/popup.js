import { getComments, addComment } from './commentApi.js';
import { getUserId } from './userId.js';

let popupOpen = false;

const showPopup = async (movie) => {
  if (popupOpen) return; // Prevent multiple popups
  popupOpen = true;
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
    popupOpen = false;
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


export { showPopup };