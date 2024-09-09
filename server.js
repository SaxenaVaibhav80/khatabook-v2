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
