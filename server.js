const express = require('express');
const app = express();
const bcrypt = require("bcryptjs")
const db= require("./config/config")
const bodyParser = require('body-parser');
const userModel = require('./models/users');
app.set('view engine', 'ejs');
const jwt= require("jsonwebtoken");
const cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())
var loggedin=0
var loggedout=1

const  auth =(req,res,next)=>
{
    const tokenFromCookie= req.cookies.token
    if (!tokenFromCookie) {
        return res.status(401).send("Please log in");
    }
    try{
        const verification =jwt.verify(tokenFromCookie,'3600103vaibhav')
        next()
    }catch(err){
        res.status(400).send("JWT TOKEN MALFORMED")
    }

}


app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const fname= req.body.fname
    const lname=req.body.lname

    if(!(fname && lname && email && password))
    {
        res.status(400).send("all field are required")
    }
    const exist = await userModel.findOne({Email:email})
    if(exist){
        res.status(402).send("user already exist")
    }
    else{
        const encryptPass= await bcrypt.hash(password,10)
        await userModel.create({
            Fname:fname,
            Lname:lname,
            Email: email,
            Password:encryptPass
        });
       
    }
    res.redirect('/');
});


const checkLoginState = (req, res, next) => {
    const token = req.cookies.token;
    let loggedIn = false;
    if (token) {
        try {
            jwt.verify(token, '3600103vaibhav');
            loggedIn = true;
        } catch (err) {
            res.status(400).send("JWT TOKEN MALFORMED")
        }
    }
    res.locals.loggedIn = loggedIn; // Set the loggedIn state in res.locals
    next(); 
};

app.get('/', checkLoginState,(req, res) => {
    res.render('index');
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!(email && password))
    {
        res.status(400).send("please provide all information")
    }
    const user = await userModel.findOne({Email:email });
    const match =await bcrypt.compare(password,user.Password)
    if((user)&& match )
    {
        loggedin=1
        loggedout=0
        const token = await jwt.sign(
            {id:user._id},
            '3600103vaibhav',  // have to use process.env.key(whatever u want to provide) its basically secure and industry standard4
            {
               expiresIn:("2h")
            }
        );
        const options={
            expires:new Date(Date.now()+3*24*60*60*1000),
            httpOnly:true
        };

        res.status(200).cookie("token",token,options)
        res.redirect("/")


    }else{
        res.status(401).send("user not present")
    }
    
});

app.get('/logout', (req, res) => {

    // Clear the token cookie
    res.cookie('token', '', { expires: new Date(0), httpOnly: true });
    loggedout=1
    res.redirect("/")

});

app.get('/Khata',auth, (req, res) => {
    res.send('Welcome to the contact page');
});

app.get('/location', auth,(req, res) => {
    res.send('Welcome to our location');
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

