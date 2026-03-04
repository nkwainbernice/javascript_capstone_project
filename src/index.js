document.getElementById('movie').addEventListener('click', async (e) => {

  if (e.target.classList.contains('comment-btn')) {

    const movieId = e.target.dataset.id;

    try {
      const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
      const movieData = await response.json();

      showPopup(movieData);