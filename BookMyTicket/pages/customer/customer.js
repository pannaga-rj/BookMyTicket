let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () =>{
  menu.classList.toggle('fa-times');
  navbar.classList.toggle('active');
}



window.onscroll = () =>{
  menu.classList.remove('fa-times');
  navbar.classList.remove('active');
}



var swiper = new Swiper(".home-slider", {
  effect: "coverflow",
  grabCursor: true,
  centeredSlides: true,
  slidesPerView: "auto",
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 2,
    slideShadows: true,
  },
  loop:true,
  autoplay:{
    delay: 3000,
    disableOnInteraction:false,
  }
});

var swiper = new Swiper(".review-slider", {
    slidesPerView: 1,
    grabCursor: true,
    loop:true,
    spaceBetween: 10,
    breakpoints: {
      0: {
          slidesPerView: 1,
      },
      700: {
        slidesPerView: 2,
      },
      1050: {
        slidesPerView: 3,
      },    
    },
   
});

function generateGallery() {
  const movies = [
    {
      poster: "..\\..\\assests\\movie_posters\\p1.jpg",
      title: "Movie Title 1",
      description: "This is a short description for Movie 1.",
      rating: "4.5",
      category: "released"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p2.jpg",
      title: "Movie Title 2",
      description: "This is a short description for Movie 2.",
      rating: "4.0",
      category: "released"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p2.jpg",
      title: "Movie Title 2",
      description: "This is a short description for Movie 2.",
      rating: "4.0",
      category: "released"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p2.jpg",
      title: "Movie Title 2",
      description: "This is a short description for Movie 2.",
      rating: "4.0",
      category: "released"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p2.jpg",
      title: "Movie Title 2",
      description: "This is a short description for Movie 2.",
      rating: "4.0",
      category: "released"
    },
    // Add more movies as needed
    {
      poster: "..\\..\\assests\\movie_posters\\p3.jpg",
      title: "Movie Title 3",
      description: "This is a short description for Movie 3.",
      rating: "3.8",
      category: "recommended"
    },

    {
      poster: "..\\..\\assests\\movie_posters\\p3.jpg",
      title: "Movie Title 3",
      description: "This is a short description for Movie 3.",
      rating: "3.8",
      category: "recommended"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p3.jpg",
      title: "Movie Title 3",
      description: "This is a short description for Movie 3.",
      rating: "3.8",
      category: "recommended"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p4.jpg",
      title: "Movie Title 4",
      description: "This is a short description for Movie 4.",
      rating: "4.2",
      category: "upcoming"
    },

    {
      poster: "..\\..\\assests\\movie_posters\\p4.jpg",
      title: "Movie Title 4",
      description: "This is a short description for Movie 4.",
      rating: "4.2",
      category: "upcoming"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p4.jpg",
      title: "Movie Title 4",
      description: "This is a short description for Movie 4.",
      rating: "4.2",
      category: "upcoming"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p4.jpg",
      title: "Movie Title 4",
      description: "This is a short description for Movie 4.",
      rating: "4.2",
      category: "upcoming"
    },
    {
      poster: "..\\..\\assests\\movie_posters\\p5.jpg",
      title: "Movie Title 4",
      description: "This is a short description for Movie 4.",
      rating: "4.2",
      category: "released"
    },
    // Add more movies
  ];

  const categories = ["released", "recommended", "upcoming"];
  const categoryTitles = {
    released: "Currently Released",
    recommended: "Recommended Movies",
    upcoming: "Upcoming Movies"
  };

  const dynamicContent = document.getElementById('dynamicContent');

  categories.forEach(category => {
    const categoryMovies = movies.filter(movie => movie.category === category);

    if (categoryMovies.length > 0) {
      // Create Category Row
      const categoryRow = document.createElement('div');
      categoryRow.classList.add('category-row');

      // Create Category Title
      const categoryTitle = document.createElement('h2');
      categoryTitle.classList.add('category-title');
      categoryTitle.textContent = categoryTitles[category];
      categoryRow.appendChild(categoryTitle);

      // Create Movie Container
      const movieContainer = document.createElement('div');
      movieContainer.classList.add('movie-container');

      // Create Movie Cards
      categoryMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');

        const moviePoster = document.createElement('img');
        moviePoster.classList.add('movie-poster');
        moviePoster.src = movie.poster;
        moviePoster.alt = movie.title;

        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie-info');

        const movieTitle = document.createElement('h3');
        movieTitle.classList.add('movie-title');
        movieTitle.textContent = movie.title;

        const movieRating = document.createElement('p');
        movieRating.classList.add('movie-rating');
        movieRating.textContent = `⭐ ${movie.rating}`;

        const bookButton = document.createElement('button');
        bookButton.classList.add('book-btn');
        bookButton.textContent = 'Book';
        bookButton.addEventListener('click', () => {
          alert(`You have booked tickets for "${movie.title}"`);
        });

        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(movieRating);
        movieInfo.appendChild(bookButton);

        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieInfo);

        movieContainer.appendChild(movieCard);
      });

      categoryRow.appendChild(movieContainer);
      dynamicContent.appendChild(categoryRow);
    }
  });
}

// Automatically generate content on page load
window.onload = function () {
  generateGallery();
};
