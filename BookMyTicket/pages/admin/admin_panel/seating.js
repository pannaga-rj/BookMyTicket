// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc, getDoc, doc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

let tid,seats;
document.addEventListener("DOMContentLoaded", function() {
    const diamondRows = ["A", "B", "C", "D", "E", "F"]; 
    const goldRows = ["G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
    const silverRows = ["Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

    const seatsGrid = document.getElementById("seats-grid");
    let selectedSeats = [];

    const theaterData = JSON.parse(sessionStorage.getItem('theaterData'));
    const index = sessionStorage.getItem('index');

    if (theaterData && index !== null) {
        document.querySelector(".TheaterName").innerText = theaterData.Name;
        tid = theaterData.id;
        seats = theaterData.Seats;
        console.log(tid);
    } else {
        console.error('TheaterData or index is missing or null');
    }


    function generateSeats(rows, className, price) {
        rows.forEach(row => {
            // Create row label
            const rowLabel = document.createElement("div");
            rowLabel.classList.add("row-label", className);
            rowLabel.textContent = row;
            seatsGrid.appendChild(rowLabel);
    
            // Generate seats
            for (let col = 1; col <= 30; col++) {
                const seatNumber = `${row}${col}`;
                const seat = document.createElement("div");
    
                if (seats && seats[seatNumber] === 'exists') {
                    seat.classList.add("seat", className);
                    seat.dataset.seatNumber = seatNumber;
                    seat.textContent = seatNumber; // Add seat number text
                    seatsGrid.appendChild(seat);
    
                    seat.addEventListener("click", function () {
                        seat.classList.toggle("selected");
                        if (seat.classList.contains("selected")) {
                            selectedSeats.push(seatNumber);
                            seat.style.color = "white"; // Change text color on selection
                        } else {
                            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
                            seat.style.color = "black"; // Reset text color when unselected
                        }
                    });
                } else if (seats && seats[seatNumber] === 'empty') {
                    seat.classList.add("seat", className, "selected");
                    seat.dataset.seatNumber = seatNumber;
                    seat.textContent = seatNumber; // Add seat number text
                    seatsGrid.appendChild(seat);
                    selectedSeats.push(seatNumber); // Automatically select this seat
    
                    seat.addEventListener("click", function () {
                        seat.classList.toggle("selected");
                        if (seat.classList.contains("selected")) {
                            selectedSeats.push(seatNumber);
                            seat.style.color = "white"; // Change text color on selection
                        } else {
                            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
                            seat.style.color = "black"; // Reset text color when unselected
                        }
                    });
                } else {
                    // Create a dummy white space for non-existing seats
                    seat.classList.add("seat", "dummy");
                    seatsGrid.appendChild(seat);
                }
            }
    
            // Generate middle gap
            const gap = document.createElement("div");
            gap.classList.add("seat-gap");
            seatsGrid.appendChild(gap);
        });
    }
    
    

    // Generate Diamond, Gold, and Silver class seats
    generateSeats(diamondRows, "diamond", 250);
    generateSeats(goldRows, "gold", 200);
    generateSeats(silverRows, "silver", 150);

    document.getElementById("selectBtn").addEventListener("click", async function () {
        // Update UI with selected seats and price
        let totalPrice = selectedSeats.reduce((sum, seat) => {
            if (seat.includes("A") || seat.includes("B") || seat.includes("C") || seat.includes("D") || seat.includes("E") || seat.includes("F")) {
                return sum + 250;
            } else if (seat.includes("G") || seat.includes("H") || seat.includes("I") || seat.includes("J") || seat.includes("K") || seat.includes("L") || seat.includes("M") || seat.includes("N") || seat.includes("O") || seat.includes("P")) {
                return sum + 200;
            } else {
                return sum + 150;
            }
        }, 0);
    
        console.log(selectedSeats);
    
        try {
            const theaterDocRef = doc(db, 'threatres', tid);
            const theaterDocSnapshot = await getDoc(theaterDocRef);
    
            if (theaterDocSnapshot.exists()) {
                const theaterData = theaterDocSnapshot.data();
                let seats = theaterData.Seats; // Assuming seats is a map
    
                if (seats) {
                    // Update seats data
                    Object.keys(seats).forEach(seat => {
                        if (seats[seat] === 'empty' && !selectedSeats.includes(seat)) {
                            seats[seat] = 'exists'; // Change empty to exists if deselected
                        }
                    });
    
                    selectedSeats.forEach(seat => {
                        if (seats[seat] !== 'empty') {
                            seats[seat] = 'empty'; // Update selected seats as empty
                        }
                    });
    
                    // Update Firestore with new seat data
                    await updateDoc(theaterDocRef, { Seats: seats });
                } else {
                    console.log('No seats data found for this theater.');
                }
            } else {
                console.log('No such document!');
            }
            alert("Theatre Structure saved Successfully.");
            window.location.href = "d.html";
        } catch (error) {
            console.error('Error updating seats:', error);
        }
    });
})    
