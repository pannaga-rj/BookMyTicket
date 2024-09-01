// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, updateDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

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
const storage = getStorage(app);

// Sidebar Toggle Logic
document.getElementById("sidebarToggle").addEventListener("click", function() {
    document.getElementById("sidebar").classList.toggle("hidden");
    document.getElementById("mainContent").classList.toggle("full-width");
});

// Tab Switch Logic
const sections = {
    moviesTab: "moviesSection",
    theatresTab: "theatresSection",
    reservationsTab: "reservationsSection",
    usersTab: "usersSection",
    cityTab: "citySection"
};

Object.keys(sections).forEach(tab => {
    document.getElementById(tab).addEventListener("click", function() {
        // Hide all sections
        Object.values(sections).forEach(section => {
            document.getElementById(section).classList.add("hidden");
        });

        // Show selected section
        document.getElementById(sections[tab]).classList.remove("hidden");

        fetchUser();
        fetchRes();
        // Highlight active tab
        document.querySelectorAll(".sidebar ul li").forEach(li => li.classList.remove("active"));
        this.classList.add("active");


    });
});

// Add Movie Form Logic
document.getElementById("addMovieBtn").addEventListener("click", function() {
    document.getElementById("addMovieForm").classList.remove("hidden");
    document.getElementById("movieForm").reset();
    document.getElementById("movieForm").dataset.editingId = ""; // Clear editing ID
});


document.getElementById("closeMovieForm").addEventListener("click", function() {
    document.getElementById("addMovieForm").classList.add("hidden");
});

// Add/Edit Movie to Firebase
document.getElementById("movieForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    const title = document.getElementById("movieTitle").value;
    const language = document.getElementById("language").value;
    const genre = document.getElementById("genre").value;
    const director = document.getElementById("director").value;
    const trailerLink = document.getElementById("trailerLink").value;
    const description = document.getElementById("description").value;
    const duration = document.getElementById("duration").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const ratings = document.getElementById("ratings").value;
    const category = document.getElementById("category").value;
    const posterFile = document.getElementById("posterImage").files[0];

    // Upload poster image to Firebase Storage
    const posterRef = ref(storage, `posters/${posterFile.name}`);
    await uploadBytes(posterRef, posterFile);
    const posterURL = await getDownloadURL(posterRef);

    const editingId = document.getElementById("movieForm").dataset.editingId;

    if (editingId) {
        // Update existing movie
        const movieRef = doc(db, "Movies", editingId);
        await updateDoc(movieRef, {
            title,
            language,
            genre,
            director,
            trailerLink,
            description,
            duration,
            startDate,
            endDate,
            ratings,
            category,
            posterURL
        });
    } else {
        // Add new movie
        await addDoc(collection(db, "Movies"), {
            title,
            language,
            genre,
            director,
            trailerLink,
            description,
            duration,
            startDate,
            endDate,
            ratings,
            category,
            posterURL
        });
    }

    // Close the form and reset
    document.getElementById("addMovieForm").classList.add("hidden");
    document.getElementById("movieForm").reset();
    document.getElementById("movieForm").dataset.editingId = ""; // Clear editing ID

    // Refresh the movie table
    fetchMovies();
});

// Function to add movie data to the table
function addMovieToTable(movieData) {
    const tableBody = document.getElementById("moviesTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${tableBody.rows.length + 1}</td>
        <td>${movieData.title}</td>
        <td><img src="${movieData.posterURL}" alt="${movieData.title} Poster" class="poster-img"></td>
        <td>${movieData.language}</td>
        <td>${movieData.genre}</td>
        <td>${movieData.director}</td>
        <td><a href="${movieData.trailerLink}" target="_blank">Watch Trailer</a></td>
        <td>${movieData.description}</td>
        <td>${movieData.duration}</td>
        <td>${movieData.startDate}</td>
        <td>${movieData.endDate}</td>
        <td>${movieData.ratings}</td>
        <td>${movieData.category}</td>
        <td><a class="delete-link" data-id="${movieData.id}">Delete</a></td>
        <td><a class="edit-link" data-id="${movieData.id}">Edit</a></td>
    `;

    tableBody.appendChild(row);
}

// Function to delete a movie
async function deleteMovie(id) {
    await deleteDoc(doc(db, "Movies", id));
    fetchMovies(); // Refresh the movie table
}

// Function to populate the form with existing data

async function editMovie(id) {
    const docRef = doc(db, "Movies", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const movieData = docSnap.data();

        // Populate the form fields with the fetched movie data
        document.getElementById("EmovieTitle").value = movieData.title || '';
        document.getElementById("Elanguage").value = movieData.language || '';
        document.getElementById("Egenre").value = movieData.genre || '';
        document.getElementById("Edirector").value = movieData.director || '';
        document.getElementById("EtrailerLink").value = movieData.trailerLink || '';
        document.getElementById("Edescription").value = movieData.description || '';
        document.getElementById("Eduration").value = movieData.duration || '';
        document.getElementById("EstartDate").value = movieData.startDate || '';
        document.getElementById("EendDate").value = movieData.endDate || '';
        document.getElementById("Eratings").value = movieData.ratings || '';
        document.getElementById("Ecategory").value = movieData.category || '';

        // Store existing poster URL in a hidden field or data attribute
        document.getElementById("EposterImage").dataset.url = movieData.posterURL;

        document.getElementById("editMovieForm").classList.remove("hidden");

        // Attach the event listener to the form submission
        document.getElementById("editMovieForm").addEventListener('submit', async function(evt) {
            evt.preventDefault(); // Prevent form from submitting and refreshing the page

            // Get updated values
            const updatedTitle = document.getElementById("EmovieTitle").value;
            const updatedLanguage = document.getElementById("Elanguage").value;
            const updatedGenre = document.getElementById("Egenre").value;
            const updatedDirector = document.getElementById("Edirector").value;
            const updatedTrailerLink = document.getElementById("EtrailerLink").value;
            const updatedDescription = document.getElementById("Edescription").value;
            const updatedDuration = document.getElementById("Eduration").value;
            const updatedStartDate = document.getElementById("EstartDate").value;
            const updatedEndDate = document.getElementById("EendDate").value;
            const updatedRatings = document.getElementById("Eratings").value;
            const updatedCategory = document.getElementById("Ecategory").value;
            const fileInput = document.getElementById("EposterImage");

            let updatedPosterURL = fileInput.dataset.url; // Default to existing URL

            // Check if a new file was selected
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const posterRef = ref(storage, `posters/${file.name}`);
                
                try {
                    await uploadBytes(posterRef, file);
                    updatedPosterURL = await getDownloadURL(posterRef);
                } catch (error) {
                    console.error("Error uploading file: ", error);
                }
            }

            try {
                await updateDoc(docRef, {
                    title: updatedTitle,
                    language: updatedLanguage,
                    genre: updatedGenre,
                    director: updatedDirector,
                    trailerLink: updatedTrailerLink,
                    description: updatedDescription,
                    duration: updatedDuration,
                    startDate: updatedStartDate,
                    endDate: updatedEndDate,
                    ratings: updatedRatings,
                    category: updatedCategory,
                    posterURL: updatedPosterURL // Use the new or existing URL
                });
                console.log("Movie updated successfully.");
                document.getElementById("editMovieForm").classList.add("hidden");
                fetchMovies(); // Refresh the movie list or similar
            } catch (error) {
                console.error("Error updating movie: ", error);
            }
        });
    } else {
        console.log("No such document!");
    }
}

// Fetch and display movies on page load
async function fetchMovies() {
    const querySnapshot = await getDocs(collection(db, "Movies"));
    const table = document.getElementById("moviesTable");
    const tbody = document.getElementById("moviesTableBody");
    tbody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach((doc) => {
        const movieData = doc.data();
        addMovieToTable({ id: doc.id, ...movieData });
    });

    // Show table after data is loaded
    table.classList.remove("hidden");
    document.querySelector(".loading").classList.add("hidden");
}

// Event listener for delete and edit actions
document.getElementById("moviesTableBody").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-link")) {
        const id = event.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this movie?")) {
            deleteMovie(id);
        }
    } else if (event.target.classList.contains("edit-link")) {
        const id = event.target.getAttribute("data-id");
        editMovie(id);
    }
});
fetchMovies();

document.getElementById("addTheaterBtn").addEventListener("click", function() {
    document.getElementById("addTheaterForm").classList.remove("hidden");
    document.getElementById("theaterForm").reset();
    document.getElementById("theaterForm").dataset.editingId = ""; // Clear editing ID
});

document.getElementById("closetheaterForm").addEventListener("click", function() {
    document.getElementById("addTheaterForm").classList.add("hidden");
});

// Add/Edit Movie to Firebase
document.getElementById('theaterForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const theaterName = document.getElementById('theaterTitle').value;
    const city = document.getElementById('city').value;
    const ticketPrice = document.getElementById('ticketPrice').value;
    const theaterImage = document.getElementById('theaterImage').files[0];

    const seats = {};
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]; 

    for (let key in rows) {
        for (let i = 1; i <= 30; i++) {
            const k = rows[key] + i;
            seats[k] = "exists"; // Corrected: using bracket notation
        }
    }

    // Get all movie names
    const movieInputs = document.getElementsByName('movieNames');
    const movies = Array.from(movieInputs)
        .map(input => input.value)
        .filter(name => name.trim() !== '');


        for (let key in movies) {
            const querySnapshot = await getDocs(collection(db, "Movies"));
            
            querySnapshot.forEach(async (docSnap) => {
                const movieData = docSnap.data();
                const id = docSnap.id; // Get the document ID
                
                if (movieData.title === movies[key]) {
                    const { title, language, genre, director, trailerLink, description, duration, startDate, endDate, ratings, category, posterURL, theater = [] } = movieData;
        
                    // Ensure theater is an array before pushing the theaterName
                    if (Array.isArray(theater)) {
                        theater.push(theaterName);
                    } else {
                       theater=[]
                       theater.push(theaterName);
                    }
        
                    // Update the existing document with the new theater array
                    const movieDocRef = doc(db, "Movies", id);
                    await updateDoc(movieDocRef, {
                        theater
                    });
        
                    console.log(`Updated movie with ID: ${id}`);
                }
            });
        }


    // Convert movie names array to array of dictionaries
    const moviesDictArray = movies.map((movie, index) => ({
        [movie]: [] // Each dictionary has the movie name as key and an empty list as value

    }));

    // Upload theater image to Firebase Storage
    const imageRef = ref(storage, `theaters/${theaterImage.name}`);
    await uploadBytes(imageRef, theaterImage);
    const imageURL = await getDownloadURL(imageRef);

    const editingId = document.getElementById('theaterForm').dataset.editingId;

   
    if (editingId) {
        // Update existing theater
        const theaterRef = doc(db, 'threatres', editingId);
        await updateDoc(theaterRef, {
            Name: theaterName,
            City:city,
            ticket_price: ticketPrice,
            t_image:imageURL,
            movie_show_tm:moviesDictArray,
            movies:movies,
            Seats:seats
        });
    } else {
        // Add new theater
        await addDoc(collection(db, 'threatres'), {
            Name: theaterName,
            City:city,
            ticket_price: ticketPrice,
            t_image:imageURL,
            movie_show_tm:moviesDictArray,
            movies:movies,
            Seats:seats
        });
    }

    // Close the form and reset
    document.getElementById("addTheaterForm").classList.add("hidden");
    document.getElementById("theaterForm").reset();
    document.getElementById("theaterForm").dataset.editingId = ""; // Clear editing ID

    // Refresh the movie table
    fetchTheater();
});
function addTheaterToTable(TheaterData) {
    const tableBody = document.getElementById("theatersTableBody");
    const row = document.createElement("tr");

    // Create rows for each movie and its corresponding showtime(s)
    const moviesAndShowtimes = TheaterData.movies.map((movie, index) => {
        const showTime = TheaterData.movie_show_tm[index] 
            ? Object.values(TheaterData.movie_show_tm[index])[0] 
            : 'No showtime'; // Fallback if there's no corresponding showtime
    
        return `
            <div class="movie-showtime-pair" style="display: flex; align-items: center; margin-bottom: 10px;">
                <div class="movie-item" style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-right: 20px;
                    padding: 10px;
                    text-align: center;
                    max-width: 150px; /* Set your desired max-width */
                    word-wrap: break-word; /* Ensure long words break to the next line */
                ">
                    ${movie}
                    <button class="add-showtime-button" type="button" data-index="${index}" style="
                        margin-top: 10px;
                        padding: 8px 15px;
                        color: #fff;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                        transition: background-color 0.3s, transform 0.2s;
                    ">Add Showtime</button>
                </div>
                <div class="movie-item movie-time-item" style="
                    padding-left: 10px;
                    text-align: center;
                ">
                    ${showTime}
                </div>
            </div>
        `;
    }).join('');

    row.innerHTML = `
    <td style="text-align: center;">${tableBody.rows.length + 1}</td>
    <td style="text-align: center;">${TheaterData.Name}</td>
    <td style="text-align: center;">${TheaterData.City}</td>
    <td style="text-align: center;">${TheaterData.ticket_price}</td>
    <td><img src="${TheaterData.t_image}" alt="${TheaterData.Name} Poster" class="poster-img"></td>
    <td style="text-align: center;">${moviesAndShowtimes}</td>
    <td style="text-align: center;">
        <button class="add-seating-button" type="button" style="
            padding: 8px 15px;
            background-color: #28a745;
            color: #fff;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s, transform 0.2s;
        ">Add Seating</button>
    </td>
    <td><a class="delete-link" data-id="${TheaterData.id}">Delete</a></td>
    <td><a class="edit-link" data-id="${TheaterData.id}">Edit</a></td>
`;

    tableBody.appendChild(row);

    // Add event listeners for each "Add Showtime" button
    row.querySelectorAll('.add-showtime-button').forEach(button => {
        button.addEventListener('click', function() {
            addShowtime(TheaterData, button.dataset.index); // Pass the row and movie index
        });
    });

    row.querySelectorAll('.add-seating-button').forEach(button => {
        button.addEventListener('click', function() {
            sessionStorage.setItem('theaterData', JSON.stringify(TheaterData));
            sessionStorage.setItem('index', button.dataset.index);
            window.location.href = 'seating.html';
        });
    });
    
    
    
}   


async function addShowtime(TheaterData, movieIndex) {
    console.log(TheaterData.movies[movieIndex]);

    // Prompt for new showtime
    const newShowtime = prompt("Enter the new showtime:");
    if (newShowtime) {
        // Ensure the movie_show_tm array is properly initialized
        if (!TheaterData.movie_show_tm) {
            TheaterData.movie_show_tm = [];
        }

        // Ensure there's an entry for the movie at the given index
        if (!TheaterData.movie_show_tm[movieIndex]) {
            TheaterData.movie_show_tm[movieIndex] = {};
        }

        // Ensure the movie has a list of showtimes
        const movieName = TheaterData.movies[movieIndex];
        if (!TheaterData.movie_show_tm[movieIndex][movieName]) {
            TheaterData.movie_show_tm[movieIndex][movieName] = [];
        }

        // Add the new showtime
        TheaterData.movie_show_tm[movieIndex][movieName].push(newShowtime);

        // Update the existing theater document in Firestore
        const theaterRef = doc(db, "threatres", TheaterData.id);
        await updateDoc(theaterRef, {
            movie_show_tm: TheaterData.movie_show_tm
        });

        console.log(`Added new showtime: ${newShowtime} to movie: ${movieName}`);
    }
    fetchTheater();
}   

// delete
async function deleteTheater(id) {

    const TRef = doc(db, "threatres", id);
    const TdocSnap = await getDoc(TRef);
    const data = TdocSnap.data();
    await deleteDoc(doc(db, "threatres", id));

    
    
    const moviesCollection = collection(db, 'Movies');

    const querySnapshot = await getDocs(moviesCollection);

    querySnapshot.forEach(async (docSnap) => {
        const movieData = docSnap.data();
        const Mid = docSnap.id; // Get the document ID
        const Theater=movieData.theater;
        try{
        if(Theater.includes(data.Name)){
            const updatedList = Theater.filter(item => item !== data.Name);
            console.log(updatedList);
            console.log(Mid);
            const movieDocRef = doc(db, "Movies", Mid);
                    await updateDoc(movieDocRef, {
                        theater:updatedList
                    });
            
        }
    }
    catch{
        console.log("Nah");
    }
    finally{
        fetchTheater(); // Refresh the movie table
        }
    });
    
}


// Fetch and display movies on page load
async function fetchTheater() {
    const querySnapshot = await getDocs(collection(db, "threatres"));
    const table = document.getElementById("theatersTable");
    const tbody = document.getElementById("theatersTableBody");
    tbody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach((doc) => {
        const TheaterData = doc.data();
        addTheaterToTable({ id: doc.id, ...TheaterData });
    });

    // Show table after data is loaded
    table.classList.remove("hidden");
    document.querySelector(".loading").classList.add("hidden");
}

async function editTheater(theaterId) {
    const theaterRef = doc(db, "threatres", theaterId);
    const docSnap = await getDoc(theaterRef);

    if (docSnap.exists()) {
        const theaterData = docSnap.data();

        document.getElementById('EtheaterTitle').value = theaterData.Name || '';
        document.getElementById('Ecity').value = theaterData.City || '';
        document.getElementById('EticketPrice').value = theaterData.ticket_price || '';

        const imageElement = document.getElementById('EtheaterImage');
        imageElement.dataset.url = theaterData.t_image || '';

        const moviesContainer = document.getElementById('EmoviesContainer');
        moviesContainer.innerHTML = '';

        // Populate form with existing movie names
        theaterData.movies.forEach(movie => {
            const movieInput = document.createElement('input');
            movieInput.type = 'text';
            movieInput.name = 'movieNames';
            movieInput.value = movie;
            movieInput.placeholder = `Enter movie name`;
            movieInput.classList.add('movie-input');
            moviesContainer.appendChild(movieInput);
        });

        // Set the editing ID in the form's data attribute
        document.getElementById('EtheaterForm').dataset.editingId = theaterId;
        document.getElementById("editTheaterForm").classList.remove("hidden");
    } else {
        console.log("No such document!");
    }
}
document.getElementById('EtheaterForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const theaterId = document.getElementById('EtheaterForm').dataset.editingId;
    const theaterName = document.getElementById('EtheaterTitle').value;
    const city = document.getElementById('Ecity').value;
    const ticketPrice = document.getElementById('EticketPrice').value;
    const theaterImage = document.getElementById('EtheaterImage').files[0];

    // Get all movie names from the form
    const movieInputs = document.getElementsByName('movieNames');
    const newMovies = Array.from(movieInputs).map(input => input.value).filter(name => name.trim() !== '');

    // Retrieve existing theater data
    const theaterRef = doc(db, 'threatres', theaterId);
    const docSnap = await getDoc(theaterRef);
    const theaterData = docSnap.data();

    let imageURL = document.getElementById('EtheaterImage').dataset.url;

    if (theaterImage) {
        const imageRef = ref(storage, `theaters/${theaterImage.name}`);
        await uploadBytes(imageRef, theaterImage);
        imageURL = await getDownloadURL(imageRef);
    }

    // Update movie_show_tm to ensure each movie has an entry
    let movie_show_tm = [];

    // Create a map of existing movie showtimes for quick lookup
    const existingMovieShowtimes = new Map(
        theaterData.movie_show_tm.map(entry => [Object.keys(entry)[0], entry[Object.keys(entry)[0]]])
    );

    // Add or update existing movies
    newMovies.forEach(movie => {
        movie_show_tm.push({
            [movie]: existingMovieShowtimes.get(movie) || [] // Use existing showtimes or start with an empty array
        });
    });

    // Remove movies not present in the updated list
    Object.keys(existingMovieShowtimes).forEach(movie => {
        if (!newMovies.includes(movie)) {
            movie_show_tm.push({
                [movie]: existingMovieShowtimes.get(movie) // Keep old showtimes
            });
        }
    });

    await updateDoc(theaterRef, {
        Name: theaterName,
        City: city,
        ticket_price: ticketPrice,
        t_image: imageURL,
        movies: newMovies,
        movie_show_tm: movie_show_tm
    });

    document.getElementById("editTheaterForm").classList.add("hidden");
    document.getElementById("EtheaterForm").reset();
    document.getElementById("EtheaterForm").dataset.editingId = "";

    fetchTheater();
});

// Close button functionality
document.getElementById('closeEtheaterForm').addEventListener('click', function() {
    document.getElementById("editTheaterForm").classList.add("hidden");
    document.getElementById("EtheaterForm").reset();
});

// Event listener for delete and edit actions
document.getElementById("theatersTableBody").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-link")) {
        const id = event.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this theater?")) {
            deleteTheater(id);
        }
    } else if (event.target.classList.contains("edit-link")) {
        const id = event.target.getAttribute("data-id");
        editTheater(id);
    }
});
fetchTheater();

// Initialize the movie table on page load




// USERS
async function fetchUser() {
    const querySnapshot = await getDocs(collection(db, "Users"));
    const table = document.getElementById("UsersTable");
    const tbody = document.getElementById("UsersTableBody");
    tbody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach((doc) => {
        const UsersData = doc.data();
        addUserToTable({ id: doc.id, ...UsersData });
    });

    // Show table after data is loaded
    table.classList.remove("hidden");
    document.querySelector(".loading").classList.add("hidden");
}

function addUserToTable(UsersData) {
    const tableBody = document.getElementById("UsersTableBody");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td style="text-align: center;">${tableBody.rows.length + 1}</td>
        <td style="text-align: center;">${UsersData.name}</td>
        <td style="text-align: center;">${UsersData.email}</td>
        <td style="text-align: center;">${UsersData.phone}</td>
        <td style="text-align: center;">${UsersData.city}</td>
        <td style="text-align: center;">${UsersData.role}</td>
        <td><a class="delete-link" data-id="${UsersData.id}">Delete</a></td>
        <td><a class="edit-link" data-id="${UsersData.id}">Edit</a></td>
    `;

    tableBody.appendChild(row);
}

document.getElementById("addUserBtn").addEventListener("click", function() {
    document.getElementById("addUsersForm").classList.remove("hidden");
    document.getElementById("UserForm").reset();
    document.getElementById("UserForm").dataset.editingId = ""; // Clear editing ID
});

document.getElementById("UsersTableBody").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-link")) {
        const id = event.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this User?")) {
            deleteUsers(id);
        }
    } else if (event.target.classList.contains("edit-link")) {
        console.log("YEs");
        const id = event.target.getAttribute("data-id");
        editUsers(id);
    }
});

async function deleteUsers(id) {
    await deleteDoc(doc(db, "Users", id));
    fetchUser(); // Refresh the movie table
}
async function editUsers(id) {
    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const userData = docSnap.data();

        // Populate the form fields with the fetched user data
        document.getElementById('Ename').value = userData.name || '';
        document.getElementById('Eemail').value = userData.email || '';
        document.getElementById('Ephone').value = userData.phone || '';
        document.getElementById('ECity').value = userData.city || '';

        document.getElementById("editUsersForm").classList.remove("hidden");

        document.getElementById('editCollectionBtn').addEventListener('click', async function(evt) {
            evt.preventDefault();
            
            const updatedName = document.getElementById('Ename').value;
            const updatedEmail = document.getElementById('Eemail').value;
            const updatedPhone = document.getElementById('Ephone').value;
            const updatedCity = document.getElementById('ECity').value;

            console.log("Updated City: ", updatedCity);

            try {
                await updateDoc(docRef, {
                    name: updatedName,
                    email: updatedEmail,
                    phone: updatedPhone,
                    city: updatedCity
                });
                console.log("User updated successfully.");
            } catch (error) {
                console.error("Error updating user: ", error);
            }

            document.getElementById("editUsersForm").classList.add("hidden");
            fetchUser();  // Refresh the user table
        }, { once: true });
    } else {
        console.log("No such document!");
    }
}

async function fetchRes() {
    const querySnapshot = await getDocs(collection(db, "Reservations"));
    const table = document.getElementById("ResTable");
    const tbody = document.getElementById("ResTableBody");
    tbody.innerHTML = ''; // Clear existing rows

    querySnapshot.forEach((doc) => {
        const ResData = doc.data();
        addResToTable({ id: doc.id, ...ResData });
    });

    // Show table after data is loaded
    table.classList.remove("hidden");
    document.querySelector(".loading").classList.add("hidden");
}

function addResToTable(ResData) {
    const tableBody = document.getElementById("ResTableBody");
    const row = document.createElement("tr");
    // Format the seats into a string
    const seatsFormatted = ResData.seats.join('\n');
    const start=[];
    for(let key in ResData.startDate){
        const temp=new Date(ResData.startDate[key]).toLocaleString();
        start.push(temp);
    }
    const orderFormat=ResData.orderId.join('\n');
    const startFormatted = start.join('\n');
    row.innerHTML = `
    <td style="text-align: center;">${tableBody.rows.length + 1}</td>
    <td style="text-align: center;">${ResData.username}</td>
    <td style="text-align: center;">${ResData.email}</td>
    <td style="text-align: center;">${ResData.contactNo}</td>
    <td style="text-align: center;">${ResData.theaterId}</td>
    <td style="text-align: center;">${ResData.movieId}</td>
    <td style="text-align: center;">${orderFormat}</td>
    <td style="text-align: center;">${ResData.paymentMethod}</td>
    <td style="text-align: center;">${seatsFormatted}</td>
    <td style="text-align: center;">${startFormatted}</td>
    <td style="text-align: center;">${ResData.totalPrice}</td>
    <td style="text-align: center;">${ResData.Payment_Status ? "Paid" : "Pending"}</td>
    <td> <a class="delete-link" data-id="${ResData.id}">Delete</a></td>
    <td><a class="edit-link" data-id="${ResData.id}">Edit</a></td>
    `;

    tableBody.appendChild(row);

    // Add event listener for "Delete" link
}
async function deleteRes(id) {
    await deleteDoc(doc(db, "Reservations", id));
    fetchRes(); // Refresh the movie table
}


async function editRes(ResId) {
    const ResRef = doc(db, "Reservations", ResId);
    const docSnap = await getDoc(ResRef);
    if (docSnap.exists()) {
        const ResData = docSnap.data();

        document.getElementById('Eusername').value = ResData.username || '';
        document.getElementById('Eemail').value = ResData.email || '';
        document.getElementById('EcontactNo').value = ResData.contactNo || '';
        document.getElementById('EmovieId').value = ResData.movieId || '';

        const moviesContainer = document.getElementById('resContainer');
        moviesContainer.innerHTML = '';

        // Populate form with existing movie names
        ResData.seats.forEach(seat => {
            const movieInput = document.createElement('input');
            movieInput.type = 'text';
            movieInput.name = 'Seats';
            movieInput.value = seat;
            movieInput.classList.add('movie-input');
            moviesContainer.appendChild(movieInput);
        });

        // Set the editing ID in the form's data attribute
        document.getElementById('eResForm').dataset.editingId = ResId;
        document.getElementById("editResForm").classList.remove("hidden");
    } else {
        console.log("No such document!");
    }
}

document.getElementById('eResForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const resId = document.getElementById('eResForm').dataset.editingId;
    const username = document.getElementById('Eusername').value;
    const email = document.getElementById('Eemail').value;
    const contactNo = document.getElementById('EcontactNo').value;
    const movieId = document.getElementById('EmovieId').value;

    // Get all seat inputs
    const seats = document.getElementsByName('Seats');
    const allSeats = Array.from(seats)
        .map(input => input.value.trim())
        .filter(value => value !== '');

    
    let sum=0;
    let newtotalPrice = allSeats.reduce((sum, seat) => {
        if (seat.includes("A") || seat.includes("B") || seat.includes("C") || seat.includes("D") || seat.includes("E") || seat.includes("F")) {
            return sum + 250;
        } else if (seat.includes("G") || seat.includes("H") || seat.includes("I") || seat.includes("J") || seat.includes("K") || seat.includes("L") || seat.includes("M") || seat.includes("N") || seat.includes("O") || seat.includes("P")) {
            return sum + 200;
        } else {
            return sum + 150;
        }
    }, 0);
    // Update reservation
    const ResRef = doc(db, 'Reservations', resId); // Ensure correct collection name
    await updateDoc(ResRef, {
        username,
        email,
        contactNo,
        movieId,
        totalPrice:newtotalPrice,
        seats: allSeats
    });

    document.getElementById("editResForm").classList.add("hidden");
    document.getElementById("eResForm").reset();
    document.getElementById("eResForm").dataset.editingId = "";

    fetchRes(); // Ensure this function is defined and fetches updated data
});

document.getElementById("ResTableBody").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-link")) {
        const id = event.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this movie?")) {
            deleteRes(id);
        }
    } else if (event.target.classList.contains("edit-link")) {
        const id = event.target.getAttribute("data-id");
            editRes(id);
    }
});

document.getElementById("closeEResForm").addEventListener("click", function() {
    document.getElementById("editResForm").classList.add("hidden");
});
