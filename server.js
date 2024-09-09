const express = require('express');
const app = express();
const db= require("./config/config")
const session = require('express-session');
const bodyParser = require('body-parser');
const userModel = require('./models/users');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    await userModel.create({
        Email: email,
        Password: password
    });
    res.redirect('/');
});

app.get('/', (req, res) => {
    const go = req.session.isLoggedIn ? 1 : 0;
    res.render('index', { go });
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await userModel.findOne({ Email: email });

    if (user && password === user.Password) {
        req.session.isLoggedIn = true; 
        res.redirect('/');
    } else {
        console.log('Invalid login credentials');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.log('Error during logout:', err);
        }
        res.redirect('/');
    });
});

const ensureLoggedIn = (req, res, next) => {
    if (req.session.isLoggedIn) {
        next();
    } else {
        console.log('Please log in');
        res.redirect('/login');
    }
};

app.use(ensureLoggedIn)

app.get('/contact', (req, res) => {
    res.send('Welcome to the contact page');
});

app.get('/location', (req, res) => {
    res.send('Welcome to our location');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});



// ---------------------------NOTE------------------

// for persistent session----------->

// Let's break this down step by step to understand how persistent sessions work, how they interact with cookies, and what happens when they expire.

// 1. User Login and Session Creation:
// Login Request: When a user logs in, the server verifies the user's credentials (like username and password).
// Session Creation: Upon successful login, the server creates a session. This session contains information about the user, such as their user ID, login status, etc.

// 2. Storing the Session:
// Server-Side Storage (Persistent): Since we are dealing with a persistent session, the session data is stored in a persistent storage like a database (e.g., MongoDB, MySQL) or a session store like Redis. This means the session data will remain available even after the server restarts.
// Session ID: The server generates a unique session ID that identifies this session.

// 3. Sending the Session ID to the Client:
// Session ID in Cookie: The server sends the session ID to the client as a cookie. This cookie is stored in the user's browser.
// Cookie Attributes: This cookie might have attributes like HttpOnly, Secure, SameSite, and an expiration date.

// 4. Subsequent Requests:
// Session ID with Each Request: For every subsequent request made by the client, the browser automatically sends this session ID cookie back to the server.
// Session Lookup: The server uses this session ID to look up the corresponding session data stored in the database or session store.
// Session Validation: If the session is valid (i.e., it hasn't expired), the server uses the session data to recognize the user and keep them logged in.

// 5. Session and Cookie Expiry:
// Session Expiry: The session has an expiration time set on the server-side. If the user is inactive for a specified period (like 30 minutes or a few days), the session expires. The session data may be removed from the session store or database depending on your server's configuration.
// Cookie Expiry: The cookie in the client’s browser also has an expiration time. If the cookie expires, the session ID is no longer sent with requests, meaning the server can't identify the user.

// 6. Re-Login and New Session:
// Expired Session: If the session expires (either due to inactivity or the server explicitly ending it), the user will be logged out.
// New Session Creation: When the user logs in again, a new session is created. The new session data is stored in the database or session store, and a new session ID cookie is sent to the client.


// ------------------------------------- for inpersistent session---------------------------------->

// User Logs In: Server creates a session and stores it in memory. The session ID is sent to the user's browser as a cookie.
// User Navigates the Site: The browser sends the session ID with each request. The server uses this ID to retrieve the session data from memory.
// Session Expires: If the user is inactive for too long or closes the browser, the session expires, and the session data is lost.
// User Re-logs In: The user must log in again, at which point a new session is created and stored in memory.

//--------------------------------- COOKIE------------------------------------------->

// What is a Cookie?
// Definition: A cookie is a small text file that a server sends to a user's web browser. The browser stores this file and sends it back to the server with each subsequent request.
// Purpose: Cookies are used to store information about the user's session, preferences, or other stateful information that helps websites remember users across different pages or visits.