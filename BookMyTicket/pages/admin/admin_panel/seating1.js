import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyADRfGEYCRg2bl2Fie01SBnf8Bsi-nePI8",
    authDomain: "movie-ticket-booking-web-2e392.firebaseapp.com",
    projectId: "movie-ticket-booking-web-2e392",
    storageBucket: "movie-ticket-booking-web-2e392.appspot.com",
    messagingSenderId: "155753864309",
    appId: "1:155753864309:web:9ea066e506350ad1266c3c",
    measurementId: "G-T6FYQTXBQ1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let tid, seats;
let reservedSeats = []; // Array to store reserved seats

document.addEventListener("DOMContentLoaded", async function () {
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
    } else {
        console.error('TheaterData or index is missing or null');
        return; // Stop execution if there's an error
    }

    // Fetch reserved seats from Firestore
    try {
        const reservationsSnapshot = await getDocs(collection(db, "Reservations"));
        reservationsSnapshot.forEach(doc => {
            const reservationData = doc.data();
            reservedSeats = reservedSeats.concat(reservationData.seats); // Assuming seats is an array
        });
    } catch (error) {
        console.error("Error fetching reserved seats:", error);
    }

    function generateSeats(rows, className, price) {
        rows.forEach(row => {
            const rowLabel = document.createElement("div");
            rowLabel.classList.add("row-label", className);
            rowLabel.textContent = row;
            seatsGrid.appendChild(rowLabel);

            for (let col = 1; col <= 30; col++) {
                const seatNumber = `${row}${col}`;
                const seat = document.createElement("div");

                if (seats && seats[seatNumber] === 'exists') {
                    seat.classList.add("seat", className);
                    seat.dataset.seatNumber = seatNumber;

                    // Create a span to hold the seat number and center it
                    const seatIndex = document.createElement("span");
                    seatIndex.classList.add("seat-index");
                    seatIndex.textContent = col;
                    seat.appendChild(seatIndex);

                    // Check if the seat is reserved
                    if (reservedSeats.includes(seatNumber)) {
                        seat.classList.add("reserved");
                        seat.style.backgroundColor = "#D70040"; // Light red color for reserved seats
                        seat.style.cursor = "not-allowed"; // Disable cursor
                        seat.removeEventListener("click", handleSeatClick); // Remove click event
                    } else {
                        seat.classList.add("available");
                        seat.addEventListener("click", handleSeatClick); // Add click event
                    }

                    seatsGrid.appendChild(seat);
                } else {
                    const seat = document.createElement("div");
                    seat.classList.add("seat", "dummy");
                    seatsGrid.appendChild(seat);
                }
            }

            const gap = document.createElement("div");
            gap.classList.add("seat-gap");
            seatsGrid.appendChild(gap);
        });
    }

    function handleSeatClick() {
        this.classList.toggle("selected");
        const seatNumber = this.dataset.seatNumber;
        if (this.classList.contains("selected")) {
            selectedSeats.push(seatNumber);
        } else {
            selectedSeats = selectedSeats.filter(s => s !== seatNumber);
        }
    }

    generateSeats(diamondRows, "diamond", 250);
    generateSeats(goldRows, "gold", 200);
    generateSeats(silverRows, "silver", 150);

    document.getElementById("selectBtn").addEventListener("click", async function () {
        // document.getElementById("ticket-count").textContent = selectedSeats.length;
        let totalPrice = selectedSeats.reduce((sum, seat) => {
            if (seat.includes("A") || seat.includes("B") || seat.includes("C") || seat.includes("D") || seat.includes("E") || seat.includes("F")) {
                return sum + 250;
            } else if (seat.includes("G") || seat.includes("H") || seat.includes("I") || seat.includes("J") || seat.includes("K") || seat.includes("L") || seat.includes("M") || seat.includes("N") || seat.includes("O") || seat.includes("P")) {
                return sum + 200;
            } else {
                return sum + 150;
            }
        }, 0);

        sessionStorage.setItem("selectedSeats", JSON.stringify(selectedSeats));
        sessionStorage.setItem("totalPrice", totalPrice);

        window.location.href = "../../payment/payment.html";
    });
});
