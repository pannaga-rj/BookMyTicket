// Function to clear the form
function clearForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('movieFields').innerHTML = '';
}

// Function to check for Enter key press and add movie fields or showtimes
function checkEnter(event, movieName) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission on Enter key
        
        if (movieName) {
            addShowtimeField(movieName);
        } else {
            addMovieField();
        }
    }
}

// Function to add movie fields dynamically
// Function to clear the form
function clearForm() {
    document.getElementById('movieForm').reset();
    document.getElementById('movieFields').innerHTML = '';
}

// Function to check for Enter key press and add movie fields or showtimes
function checkEnter(event, movieName) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent form submission on Enter key
        
        if (movieName) {
            addShowtimeField(movieName);
        } else {
            addMovieField();
        }
    }
}

// Function to add movie fields dynamically
function addMovieField() {
    const movieNamesInput = document.getElementById('movieNames');
    const movieFieldsContainer = document.getElementById('movieFields');
    
    const movieName = movieNamesInput.value.trim();
    
    if (movieName && !document.getElementById(`movieField_${movieName}`)) {
        const movieField = document.createElement('div');
        movieField.id = `movieField_${movieName}`;
        movieField.classList.add('movie-field');
        
        movieField.innerHTML = `
            <label for="${movieName}">${movieName} Showtimes</label>
       
            <div class="showtimes-container">
                <div class="showtime-field">
                    <input type="text" name="${movieName}[]" placeholder="Enter showtime">
                </div>
            </div>
            <button type="button" class="add-showtime-btn" onclick="addShowtimeField('${movieName}')">Add Showtime</button>
         `;
        
        movieFieldsContainer.appendChild(movieField);
        movieNamesInput.value = ''; // Clear the input field after adding
    } else if (movieName) {
        alert(`The movie "${movieName}" is already added.`);
    }
}

// Function to add showtime fields for an existing movie
function addShowtimeField(movieName) {
    const movieField = document.getElementById(`movieField_${movieName}`);
    
    if (movieField) {
        const showtimesContainer = movieField.querySelector('.showtimes-container');
        
        if (showtimesContainer) {
            const newShowtimeField = document.createElement('div');
            newShowtimeField.className = 'showtime-field';
            newShowtimeField.innerHTML = `
                <input type="text" name="${movieName}[]" placeholder="Enter additional showtime">
            `;
            showtimesContainer.appendChild(newShowtimeField);
            
            // Set focus to the new showtime field
            const lastInput = showtimesContainer.querySelector('input:last-of-type');
            lastInput.focus();
        }
    }
}