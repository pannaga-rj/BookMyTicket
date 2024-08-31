import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@latest/swiper-bundle.esm.browser.min.js';

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
const auth = getAuth();

// Profile Dropdown Toggle
document.getElementById('profileIcon').addEventListener('click', function() {
    const dropdown = document.getElementById('profileDropdown');
    dropdown.style.display = dropdown.style.display === 'none' || dropdown.style.display === '' ? 'block' : 'none';
});

// Close Profile Dropdown
document.getElementById('closeProfileDropdown').addEventListener('click', function() {
    document.getElementById('profileDropdown').style.display = 'none';
});

// Logout Button
document.getElementById('logoutBtn').addEventListener('click', function() {
    signOut(auth).then(() => {
        // Clear local storage
        localStorage.removeItem('loggedInUserId');
        // Redirect to home page
        window.location.href = '../home/home.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Load Profile Data
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Fetch user data
        const userRef = doc(db, "Users", user.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data();
                document.getElementById('profileName').textContent = `Name: ${userData.name}`;
                document.getElementById('profileEmail').textContent = `Email: ${userData.email}`;
                document.getElementById('profileCity').textContent = `City: ${userData.city}`;
                document.getElementById('profilePhone').textContent = `Phone: ${userData.phone}`;
            } else {
                console.log("No such document!");
            }
        }).catch((error) => {
            console.error("Error getting document: ", error);
        });
    } else {
        // Redirect to home page if no user is authenticated
        window.location.href = '../../home/home.html';
    }
});

async function getTrendingMovies() {
    try {
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = '';
        const querySnapshot = await getDocs(collection(db, 'Movies'));
        querySnapshot.forEach((doc) => {
            const getdata = doc.data();
            if (getdata['category'].includes('trending')) {
                let swiperSlide = document.createElement("div");
                swiperSlide.classList.add("swiper-slide");

                let img = document.createElement("img");
                img.setAttribute('src', getdata['posterURL']);
                img.setAttribute("alt", getdata['title']);

                swiperSlide.appendChild(img);
                swiperWrapper.appendChild(swiperSlide);
            }
        });

        // Initialize Swiper after dynamically adding slides
        new Swiper(".home-slider", {
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

async function generateGallery() {
    try {
        const querySnapshot = await getDocs(collection(db, 'Movies'));
        const getdata = [];
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
                        window.location.href = '../booking/book.html';
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
    } catch (error) {
        console.error('Error generating gallery: ', error);
    }
}

// MENU
let menu = document.querySelector('#menu-bars');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}

// Automatically generate content on page load
window.onload = function() {
    // Clear history to prevent going back to this page after logout
    if (performance.navigation.type === performance.navigation.TYPE_BACK_FORWARD) {
        window.history.forward();
    }
    
    getTrendingMovies();
    generateGallery();
};



