import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, query, getDocs, where, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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
        window.location.href = '../../home/home.html';
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

// Movie Data from admin home page
const movieData = JSON.parse(localStorage.getItem('movieData'));
if (movieData) {
    document.getElementById('moviePoster').src = movieData.posterURL;
    document.getElementById('movieTitle').textContent = movieData.title;
    document.getElementById('movieLanguage').textContent = `Language: ${movieData.language}`;
    document.getElementById('movieDuration').textContent = `Duration: ${movieData.duration}`;
    document.getElementById('movieGenre').textContent = `Genre: ${movieData.genre}`;
    document.getElementById('movieStartDate').textContent = `Start Date: ${movieData.startDate}`;
    
    document.getElementById('movieDirector').textContent = `Movie Director: ${movieData.director}`;
    document.getElementById('movieDescription').textContent = movieData.description;


    // Play icon click event
    document.getElementById('playIcon').addEventListener('click', function() {
        const trailerURL = movieData.trailerLink;
        if (trailerURL) {
            // Open trailer in a new window or modal
            window.open(trailerURL, '_blank');
        } else {
            console.log("Trailer link not available!");
        }
    });
} else {
    console.log("No movie data found!");
}




// date
// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const dateContainer = document.getElementById('dateContainer');
    const leftArrow = document.getElementById('leftArrow');
    const rightArrow = document.getElementById('rightArrow');
    const theatreSection = document.createElement('div');
    theatreSection.id = 'theatreSection';
    document.body.appendChild(theatreSection);

    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const monthsOfYear = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

    const today = new Date();

    // Create date boxes
    for (let i = 0; i < 10; i++) {
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + i);

        const day = daysOfWeek[futureDate.getDay()];
        const date = futureDate.getDate();
        const month = monthsOfYear[futureDate.getMonth()];

        const dateBox = document.createElement('div');
        dateBox.classList.add('date-box');

        if (i === 0) {
            dateBox.classList.add('selected');  // Highlight the current date
        }

        dateBox.innerHTML = `
            <span class="day">${day}</span>
            <span class="date">${date}</span>
            <span class="month">${month}</span>
        `;

        // Add click event listener to date box
        dateBox.addEventListener('click', () => {
            document.querySelectorAll('.date-box').forEach(box => box.classList.remove('selected'));
            dateBox.classList.add('selected');
            fetchAndRenderTheatres();
        });

        dateContainer.appendChild(dateBox);
    }

    // Arrow functionality
    const scrollAmount = 150; // Adjust this value as needed

    leftArrow.addEventListener('click', () => {
        dateContainer.scrollLeft -= scrollAmount;
    });

    rightArrow.addEventListener('click', () => {
        dateContainer.scrollLeft += scrollAmount;
    });

   // Fetch and render theatres based on the user's city
// Fetch and render theatres
async function fetchAndRenderTheatres() {
    try {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDocRef = doc(db, 'Users', user.uid);
                const userDoc = await getDoc(userDocRef);
                const userCity = userDoc.data().city;

                console.log("User City:", userCity);

                const theatresQuery = query(collection(db, 'threatres'), where('City', '==', userCity));
                const theatresSnapshot = await getDocs(theatresQuery);
                
                if (theatresSnapshot.empty) {
                    console.log("No theatres found in the user's city.");
                } else {
                    console.log("Theatres found:", theatresSnapshot.docs.length);
                }

                const theatres = theatresSnapshot.docs.map(doc => {
                    const data = doc.data();
                    console.log("Theatre Data:", data);
                    return data;
                });
        
                // Getting showtimes for filtered theatres for the selected movie
                const filteredTheatres = theatres.filter(theatre => {
                    return theatre.movie_show_tm.some(showtimeObj => showtimeObj.hasOwnProperty(movieData.title));
                });

                renderTheatres(filteredTheatres);
            } else {
                console.error('No user is logged in');
            }
        });
    } catch (error) {
        console.error('Error fetching theatres:', error);
    }
}

// Render the list of theatres and their respective showtimes
function renderTheatres(theatres) {
    const theatreSection = document.getElementById('theatreSection');
    theatreSection.innerHTML = ''; // Clear previous content

    if (theatres.length === 0) {
        theatreSection.innerHTML = '<p>No theatres available in your city showing this movie.</p>';
        return;
    }

    theatres.forEach(theatre => {
        const theatreBox = document.createElement('div');
        theatreBox.classList.add('theatre-box');

        theatreBox.innerHTML = `<h4>${theatre.Name}</h4>`;

        // Initialize an array to store the showtimes
        let showtimes = [];

        if (Array.isArray(theatre.movie_show_tm)) {
            theatre.movie_show_tm.forEach(showtimeObj => {
                if (showtimeObj[movieData.title]) {
                    const showtimeValue = showtimeObj[movieData.title];

                    // Check if showtimeValue is a string
                    if (typeof showtimeValue === 'string') {
                        // Split the showtimes by comma and trim whitespace
                        showtimes = showtimes.concat(showtimeValue.split(',').map(time => time.trim()));
                    } else if (Array.isArray(showtimeValue)) {
                        // If it's an array, concatenate its elements as strings
                        showtimes = showtimes.concat(showtimeValue.map(time => time.toString()));
                    } else {
                        console.error(`Unexpected type for showtimeValue: ${typeof showtimeValue}`);
                    }
                }
            });
        }

        console.log(showtimes);
        // let l = showtimes[0].split(',');
        // console.log("L", l);
        
        
        // // If showtimes were found, render them
        if (showtimes.length > 0) {
            const showtimeContainer = document.createElement('div');
            showtimeContainer.classList.add('showtime-container');

            showtimes.forEach(time => {
                const showtimeBox = document.createElement('button');
                showtimeBox.classList.add('showtime-box');
                showtimeBox.textContent = time;

                // Add click event listener to each showtime
                showtimeBox.addEventListener('click', () => {
                    // Store the selected movie, theatre, and showtime in localStorage
                    localStorage.setItem('selectedMovie', JSON.stringify(movieData));
                    localStorage.setItem('selectedTheatre', JSON.stringify(theatre));
                    localStorage.setItem('selectedShowtime', time);

                    // Redirect to seating1.html
                    window.location.href = '../admin_panel/seating1.html';
                });

                showtimeContainer.appendChild(showtimeBox);
            });

            theatreBox.appendChild(showtimeContainer);
        } else {
            theatreBox.innerHTML += '<p>No showtimes available for this movie.</p>';
        }

        theatreSection.appendChild(theatreBox);
    });
}


// Initial fetch when the page loads
fetchAndRenderTheatres();
});
