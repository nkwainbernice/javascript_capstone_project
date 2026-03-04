import './style.css';
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
    movieDescription.innerHTML = `Description: ${movie.summary}`; 

    //button container
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');

    //like button
    const likeButton = document.createElement('span');
    likeButton.innerHTML = '&#10084;'; // Heart symbol
    likeButton.classList.add('like-button');
   
    //Comment button
    const commentButton = document.createElement('button');
    commentButton.classList.add('comment-button');
    commentButton.textContent = 'Comments';
    commentButton.dataset.id = movie.id;

    //Movie counter
    const counter = document.getElementById('movie-count');
    if (counter) {
      counter.textContent = ` Movies (${movies.length})`;

    }





    movieElement.appendChild(movieTitle);
    movieElement.appendChild(movieImage);
    movieElement.appendChild(movieType);
    movieElement.appendChild(movieLanguage);
    movieElement.appendChild(movieGenres);
    movieElement.appendChild(movieDescription);
    buttonContainer.appendChild(likeButton);
    buttonContainer.appendChild(commentButton);
    movieElement.appendChild(buttonContainer);
    movieContainer.appendChild(movieElement);

  });
};
//event listener
document.getElementById('movie').addEventListener('click',async (e) => {
  if (e.target.classList.contains('comment-button')) {
    const movieId = e.target.dataset.id;
    try{
      const response = await fetch(`https://api.tvmaze.com/shows/${movieId}`);
      const movieData = await response.json();
      showPopup(movieData);

    } catch (error){
      console.error("Error fetching single movie:",error);

    }
  }
} );