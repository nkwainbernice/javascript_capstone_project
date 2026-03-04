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
    movieImage.src = movie.image ? movie.image.medium : 'default-image-url.jpg';
    
    const movieType = document.createElement('p');
    movieType.textContent = `Type: ${movie.type}`;

    const movieLanguage = document.createElement('p');
    movieLanguage.textContent = `Language: ${movie.language}`;

    const movieGenres = document.createElement('p');
    movieGenres.textContent = `Genres: ${movie.genres.join(', ')}`;

    const movieDescription = document.createElement('p');
    movieDescription.innerHTML = `Description : ${movie.summary}`;  

    movieElement.appendChild(movieTitle);
    movieElement.appendChild(movieImage);
    movieElement.appendChild(movieType);
    movieElement.appendChild(movieLanguage);
    movieElement.appendChild(movieGenres)
     movieElement.appendChild(movieDescription)
    movieContainer.appendChild(movieElement);
  });
};