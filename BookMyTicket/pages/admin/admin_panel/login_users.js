import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword,  } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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

// User registration
document.getElementById('createCollectionBtn').addEventListener('click', async function(evt) {
    document.getElementById("addUsersForm").classList.add("hidden");

    evt.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('UCity').value;
    console.group(city);
    if (!validateEmail(email)) {
        alert('Invalid email address.');
        return;
    }

    if (!validatePhone(phone)) {
        alert('Invalid phone number.');
        return;
    }

    try {
        // Create the user in Firebase Authentication
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Check if the user is an admin
        const adminDoc = await getDoc(doc(db, "Admin", email));
        let role = 'customer'; // Default role
        
        if (adminDoc.exists()) {
            role = 'admin'; // Set role as admin if email is found in admins collection
        }

        // Create the user document in Firestore without storing the password
        const userData = {
            name: name,
            email: email,
            role: role,
            phone: phone,
            city: city,
            createdAt: new Date()
        };
        
        await setDoc(doc(db, "Users", user.uid), userData);

        alert("User registered successfully!");
        fetchUser();
    } catch (error) {
        console.error('Error registering user: ', error);
        if (error.code === 'auth/email-already-in-use') {
            display_message("Email address already exists", "signup_message");
        } else {
            display_message('Error registering user.', "signup_message");
        }
    }
});

// Function to validate email
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Function to validate phone number
function validatePhone(phone) {
    const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number
    return phonePattern.test(phone);
}

// Function to display a message
function display_message(message, divid) {
    var msg_div = document.getElementById(divid);
    msg_div.style.display = 'block';
    msg_div.innerHTML = message;
    msg_div.style.opacity = 1;
    setTimeout(function(){
        msg_div.style.opacity = 0;
    }, 5000);
}

document.getElementById("closeUserForm").addEventListener("click", function() {
    document.getElementById("addUsersForm").classList.add("hidden");
});

document.getElementById("closeeUserForm").addEventListener("click", function() {
    document.getElementById("editUsersForm").classList.add("hidden");
});


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
