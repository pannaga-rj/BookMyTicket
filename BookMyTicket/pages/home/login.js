import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

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

// User login
document.getElementById('loginBtn').addEventListener('click', async function(evt) {
    evt.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        display_message("Login Successful!!", "signin_message");
        const user = userCredential.user;

        // Get user document
        const userDoc = await getDoc(doc(db, "Users", user.uid));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const redirectUrl = userData.role === 'admin' ? "../admin/admin_home/adminhome.html" : "../customer/customerhome.html";
            window.location.href = redirectUrl;
        } else {
            alert('User not found.');
        }
    })
    .catch((error) => {
        console.error('Error logging in: ', error);
        alert('Error logging in.');
    });
});

// User registration
document.getElementById('createCollectionBtn').addEventListener('click', async function(evt) {
    evt.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const phone = document.getElementById('phone').value;
    const city = document.getElementById('city').value;

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
        document.getElementById('loginTab').click(); // Switch to login tab
    } catch (error) {
        console.error('Error registering user: ', error);
        if (error.code === 'auth/email-already-in-use') {
            display_message("Email address already exists", "signup_message");
        } else {
            display_message('Error registering user.', "signup_message");
        }
    }
});

// Tab switching
document.getElementById('loginTab').addEventListener('click', function() {
    document.getElementById('loginContent').classList.add('active');
    document.getElementById('registerContent').classList.remove('active');
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
});

document.getElementById('registerTab').addEventListener('click', function() {
    document.getElementById('loginContent').classList.remove('active');
    document.getElementById('registerContent').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.getElementById('registerTab').classList.add('active');
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

// Redirect to home page
document.getElementById('homeBtnLogin').addEventListener('click', function() {
    window.location.href = 'home.html';
});

document.getElementById('homeBtnRegister').addEventListener('click', function() {
    window.location.href = 'home.html';
});

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
