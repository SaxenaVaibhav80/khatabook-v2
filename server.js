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
    try{
        const verification =jwt.verify(tokenFromCookie,'3600103vaibhav')
        next()
    }catch(err){
        if (err.name === 'TokenExpiredError' || !tokenFromCookie) {
                res.redirect("/")
            }
        else {
            res.status(401).send("malformed token")
        }
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
        res.status(401).send("user already exist")
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
                 res.redirect("/")
                } 
            else {
                res.status(401).send("malformed token")
            }
        }
    }
    res.locals.loggedIn = loggedIn; // Set the loggedIn state in res.locals
    next(); 
};

app.get('/',checkLoginState,async(req, res) => {
    const tokenFromCookie = req.cookies.token;
    if(tokenFromCookie)
    {  
        const verification = jwt.verify(tokenFromCookie, '3600103vaibhav')
        const id = verification.id;
        const khatauser = await khataModel.findOne({ userid: id})
       if(khatauser){
        res.render('index',{khata_array:khatauser.khata,isEncrypted:khatauser.isEncrypted});
       }else{
        res.render('index',{khata_array:[]});
       }
    }
    else{
        res.render('index',{khata_array:[]});
    }
    
});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if(!(email && password))
    {
        res.status(401).send("please provide all information")
    }
    const user = await userModel.findOne({Email:email });
    if((user)&& await bcrypt.compare(password,user.Password) )
    {
        const token = await jwt.sign(
            {id:user._id},
            '3600103vaibhav',  // have to use process.env.key(whatever u want to provide) its basically secure and industry standard4
            {
               expiresIn:("24h")
            }
        );
        const options={
            expires:new Date(Date.now()+24*60*60*1000),
            httpOnly:true
        };

        res.status(200).cookie("token",token,options)
        res.redirect("/")
    }else{
        res.status(401).send("user not present")
    }
    
});

app.get('/logout', (req, res) => {
    const token=req.cookies.token
    res.cookie('token', token, { expires: new Date(0), httpOnly: true });
    res.redirect("/")

});
app.get("/ADDkhata",auth,async(req,res)=>
{
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // Adding 1 to get the correct month number
    const day = now.getDate();
    const date = `${day}-${month}-${year}`;
    
    try{
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
        else{
            res.render("addkhata")
        }
    }catch(err){
        res.status(400)
    }
    

})
app.post('/ADDKhata',auth, async (req, res) => {
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
    const isEncrypted= req.body.enc
    if(isEncrypted){
        await khataModel.updateOne(
            { userid: id },
            {
                $push: {
                    khata: { date: date, data: data, khataname: kname,isEncrypted:true}
                }
            }
        );
    }
    else if(isEncrypted==undefined){
        await khataModel.updateOne(
            { userid: id },
            {
                $push: {
                    khata: { date: date, data: data, khataname: kname }
                }
            }
        );
    }
    else
    {
        res.status(401).send("please enter pass word !!")
    }
    res.redirect("/");
});

app.get("/viewkhata/:date",auth,async(req,res)=>
{
    const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
        const id = verification.id;
        const date= req.params.date
        const user = await khataModel.findOne(
            { 
                userid: id, 
                khata: { $elemMatch: { date: date } } // Extract only the matching khata element
            },
            { 'khata.$': 1 } 
        );
        res.render("viewkhata",{date:user.khata[0].date,title:user.khata[0].khataname,data:user.khata[0].data})

        }
})

app.get("/editkhata/:date",auth,async(req,res)=>
{
    const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
        const id = verification.id;
        const date= req.params.date
        const user = await khataModel.findOne(
            { 
                userid: id, 
                khata: { $elemMatch: { date: date } } // Extract only the matching khata element
            },
            { 'khata.$': 1 } 
        );
        res.render("edit",{data:user.khata[0].data,date:date,title:user.khata[0].khataname,isEncrypted:user.khata[0].isEncrypted})
       } 
})
app.get("/deletekhata/:date",auth,async(req,res)=>
    {
       const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
        const id = verification.id;
        const date= req.params.date
        await khataModel.updateOne(
         { userid: id },
         {
             $pull: {
                 khata: { date:date }
             }
         }
       );

       }
    res.redirect("/")
})

app.post("/updatekhata/:date",auth,async(req,res)=>
    {
       const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, '3600103vaibhav');
        const id = verification.id;
        const date= req.params.date
        const data= req.body.data
        const title = req.body.title
        const isEncrypted=req.body.enc
        let val=false

        if(isEncrypted)
        {
            val=true
        }
        else{
            val=false
        }
        const user= await khataModel.findOne({userid:id,khata:{ $elemMatch: { date: date } }},{ 'khata.$': 1 })

        await khataModel.updateOne(
            {userid:id,'khata.date':date},

            {
                $set: {
                    "khata.$.data": data,
                    "khata.$.khataname": title, 
                    "khata.$.isEncrypted": val
                }
            },
            {new:true}
        )

       }
    res.redirect("/")
})


   

app.get('/location', auth,(req, res) => {
    res.send('Welcome to our location');
});


app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

