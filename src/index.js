const fetchMovie = async () => {
  try {
    const response = await fetch('https://api.tvmaze.com/shows');
    const data = await response.json();

    console.log(data);
    displayMovie(data);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

fetchMovie();

const displayMovie = (movies) => {
  const movieContainer = document.getElementById('movie');
  movieContainer.innerHTML = '';

  movies.forEach(movie => {
    const movieElement = document.createElement('div')
    movieElement.classList.add('movie-card');
    

    const movieTitle = document.createElement('h3');
    movieTitle.textContent = movie.name;

    const movieImage = document.createElement('img');
    movieImage.src = movie.image ? movie.image.medium : '';
    
    const movieType = document.createElement('p');
    movieType.textContent = `Type: ${movie.type}`;

    const movieLanguage = document.createElement('p');
    movieLanguage.textContent = `Language: ${movie.language}`;

    movieElement.appendChild(movieTitle);
    movieElement.appendChild(movieImage);
    movieElement.appendChild(movieType);
    movieElement.appendChild(movieLanguage);

    movieContainer.appendChild(movieElement);
  });
};