import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
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
        window.location.href = '../home/home.html';
    }).catch((error) => {
        console.error('Error signing out: ', error);
    });
});

// Load Profile Data
let userData;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Fetch user data
        const userRef = doc(db, "Users", user.uid);
        getDoc(userRef).then((docSnap) => {
            if (docSnap.exists()) {
                userData = docSnap.data();
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
        window.location.href = '../home/home.html';
    }
});

document.getElementById("Home").addEventListener('click',() =>{
    if(userData.role == 'customer')
        window.location.href = "customerhome.html";
    else
        window.location.href = "../admin/admin_home/adminhome.html";
});
async function displayReservations(userEmail) {
  try {
      const reservationsRef = collection(db, 'Reservations');
      const reservationSnapshot = await getDocs(reservationsRef);

      const reservationsTable = document.getElementById('reservationsTable');
      const reservationsTableBody = document.getElementById('reservationsTableBody');
      reservationsTableBody.innerHTML = ''; // Clear existing table rows

      let hasReservations = false;
      let keysSet = new Set(); // To store all unique keys for column headers

      // Find documents where ID ends with user email
      reservationSnapshot.forEach(doc => {
          const docId = doc.id;

          if (docId.endsWith(userEmail)) {
              hasReservations = true;
              const reservation = doc.data();

              // Add all keys to the keysSet to create table headers
              Object.keys(reservation).forEach(key => {
                  keysSet.add(key);
              });
          }
      });

      if (!hasReservations) {
          reservationsTableBody.innerHTML = '<tr><td colspan="2">No reservations found.</td></tr>';
          return;
      }

      // Create table headers based on the collected keys
      const tableHeaderRow = document.createElement('tr');
      keysSet.forEach(key => {
          const headerCell = document.createElement('th');
          headerCell.textContent = key;
          tableHeaderRow.appendChild(headerCell);
      });
      reservationsTable.querySelector('thead').innerHTML = ''; // Clear previous headers
      reservationsTable.querySelector('thead').appendChild(tableHeaderRow);

      // console.log(userEmail);
      // Populate table rows with reservation data
      reservationSnapshot.forEach(doc => {
          const docId = doc.id;
     

          if (docId.endsWith(userEmail)) {
            // console.log(docId);
              const reservation = doc.data();
              const row = document.createElement('tr');

              keysSet.forEach(key => {
                console.log(key);
                  const cell = document.createElement('td');
                  cell.textContent = reservation[key] || '';
                  console.log(reservation[key]); // Fill in with value or empty if key doesn't exist
                  row.appendChild(cell);

              });

              reservationsTableBody.appendChild(row);
          }
      });

  } catch (error) {
      console.error('Error displaying reservations: ', error);
  }
}

// Load user reservations on page load
window.onload = function () {
  onAuthStateChanged(auth, (user) => {
      if (user) {
          displayReservations(user.email);
      } else {
          window.location.href = '../BookMyTicket/pages/home/home.html';
      }
  });
};


// Load user reservations on page load
window.onload = function () {
  onAuthStateChanged(auth, (user) => {
      if (user) {
          displayReservations(user.email);
      } else {
          window.location.href = '../home/home.html';
      }
  });
};


// Load user reservations on page load
window.onload = function () {
    // Redirect to home page if no user is authenticated
    onAuthStateChanged(auth, (user) => {
        if (user) {
            displayReservations(user.email);
        } else {
            window.location.href = '../home/home.html';
        }
    });
};

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


