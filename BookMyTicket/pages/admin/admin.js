// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

// Initialize Firestore
const db = getFirestore(app);

// Function to create collection and add document
async function createcollection() {
  try {
    await addDoc(collection(db, "myCollection"), {
      name: 'Sample Document',
      createdAt: new Date()
    });
    console.log('Collection created and document added successfully!');
  } catch (error) {
    console.error('Error creating collection: ', error);
  }
}

// Add event listener to the button
document.getElementById('createCollectionBtn').addEventListener('click', createcollection);
