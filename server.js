const express = require('express');
const app = express();
const bcrypt = require("bcryptjs")
const db= require("./config/config")
const bodyParser = require('body-parser');
const userModel = require('./models/users');
const khataModel= require("./models/khaata")
app.set('view engine', 'ejs');
const jwt= require("jsonwebtoken");
const cookieParser = require('cookie-parser');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cookieParser())


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
        const user=await userModel.create({
            Fname:fname,
            Lname:lname,
            Email: email,
            Password:encryptPass
        });
       
        const id=user._id

        await khataModel.create({
            userid:id,
            khata:[]
        });

        res.redirect('/');
    }
    
});


const checkLoginState = (req, res, next) => {
    const token = req.cookies.token;
    let loggedIn = false;
    if (token) {
        try {
            jwt.verify(token, '3600103vaibhav');
            loggedIn = true;
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                res.redirect("/logout")
            } else {
                res.status(401).send("malformed token")
            }
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
    if((user)&& await bcrypt.compare(password,user.Password) )
    {
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
    res.redirect("/")

});
app.get("/ADDkhata",auth,async(req,res)=>
{
    const data = req.body.data;
    const kname = req.body.khataname;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Adding 1 to get the correct month number
    const day = now.getDate();
    const date = `${day}-${month}-${year}`;
    const tokenFromCookie = req.cookies.token;
    const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
    const id = verification.id;
    const khatauser = await khataModel.findOne({
        $and: [{ userid: id }, { 'khata.date': date }]
    });
    if(khatauser)
    {
        res.status(401).send("khata already avilable")
    }
    res.render("addkhata")
})
app.post('/ADDKhata', auth, async (req, res) => {
    const data = req.body.data;
    const kname = req.body.khataname;
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Adding 1 to get the correct month number
    const day = now.getDate();
    const date = `${day}-${month}-${year}`;
    const tokenFromCookie = req.cookies.token;
    const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
    const id = verification.id;

    await khataModel.updateOne(
        { userid: id },
        {
            $push: {
                khata: { date: date, data: data, khataname: kname }
            }
        }
    );
    res.redirect("/");
});

app.get("/viewkhata:date",(req,res)=>
{
  
})
app.get('/location', auth,(req, res) => {
    res.send('Welcome to our location');
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

