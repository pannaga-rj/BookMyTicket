import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js';
import { getFirestore, collection, getDocs} from 'https://www.gstatic.com/firebasejs/9.12.0/firebase-firestore.js';


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADRfGEYCRg2bl2Fie01SBnf8Bsi-nePI8",
  authDomain: "movie-ticket-booking-web-2e392.firebaseapp.com",
  projectId: "movie-ticket-booking-web-2e392",
  storageBucket: "movie-ticket-booking-web-2e392.appspot.com",
  messagingSenderId: "155753864309",
  appId: "1:155753864309:web:9ea066e506350ad1266c3c",
  measurementId: "G-T6FYQTXBQ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getTrendingMovies() {
  let c = 0;
  try {

    const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = '';
    const querySnapshot = await getDocs(collection(db, 'Movies'));
    querySnapshot.forEach((doc) => {

        const getdata = doc.data();

        console.log(getdata['posterURL']);
        if(getdata['category'].includes('trending')){
          let swiperSlide = document.createElement("div");
            swiperSlide.classList.add("swiper-slide");

            let img = document.createElement("img");
            img.setAttribute('src', getdata['posterURL']);
            img.setAttribute("alt", getdata['title']);

            swiperSlide.appendChild(img);
            swiperWrapper.appendChild(swiperSlide);
          c++;
        }
    });

// Initialize Swiper after dynamically adding slides
const swiperHome = new Swiper(".home-slider", {
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
  loop: true,
  autoplay: {
      delay: 3000,
      disableOnInteraction: false,
  },
  pagination: {
      el: '.swiper-pagination',
      clickable: true,
  },
  navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
  },
});

} catch (error) {
    console.error('Error fetching documents: ', error);
}

}



// MENU
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







// Trending Movies





// Recommded movies

// script.js  poster: "..\\..\\assests\\movie_posters\\p1.jpg",

// Move the code inside a function
// Function to generate the gallery content
async function generateGallery() {

// Initialize Firebase
let getdata = [];
const querySnapshot = await getDocs(collection(db, 'Movies'));
querySnapshot.forEach((doc) => {

    getdata.push(doc.data());
});


  const categories = ["released", "recommended", "upcoming"];
    const categoryTitles = {
        released: "Currently Released",
        recommended: "Recommended Movies",
        upcoming: "Upcoming Movies"
    };

    const dynamicContent = document.getElementById('dynamicContent');

    categories.forEach(category => {
        const categoryMovies = getdata.filter(movie => movie.category.includes(category));

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
                moviePoster.src = movie.posterURL;
                moviePoster.alt = movie.title;

                const movieInfo = document.createElement('div');
                movieInfo.classList.add('movie-info');

                const movieTitle = document.createElement('h3');
                movieTitle.classList.add('movie-title');
                movieTitle.textContent = movie.title;

                const movieRating = document.createElement('p');
                movieRating.classList.add('movie-rating');
                movieRating.textContent = `⭐ ${movie.ratings}`;

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
window.onload = function() {
    getTrendingMovies();

    var swiper = new Swiper('.home-slider', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
          rotate: 0,
          stretch: 0,
          depth: 100,
          modifier: 2,
          slideShadows: true,
      },
      loop: true,
      autoplay: {
          delay: 3000,
          disableOnInteraction: false,
      },
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
      },
  });
    generateGallery();
};
