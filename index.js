const express = require('express');
const app = express();
require("dotenv").config();
const key =process.env.SECRET_KEY
const PORT= process.env.PORT
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
        const verification =jwt.verify(tokenFromCookie,key)
        next()
    }catch(err){
        if(!tokenFromCookie)
          {
            res.redirect("/")
          }
        else if (err.name === 'TokenExpiredError' || !tokenFromCookie) {
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
            jwt.verify(token, key);
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
    // res.redirect("/logout")
    const tokenFromCookie = req.cookies.token;
    if(tokenFromCookie)
    {  
        const verification = jwt.verify(tokenFromCookie,key)
        const id = verification.id;
        const user = await userModel.findOne({ _id: id})
        const khatauser = await khataModel.findOne({ userid: id})
        const dec_sort=[]
        const khata_array=khatauser.khata
        const len= khata_array.length
        for (let i=len-1;i>=0;i--) 
        {
            dec_sort.push(khata_array[i])
        }
       if(khatauser){
        res.render('index',{oldToNew_array:khata_array,newToOld_array:dec_sort,isEncrypted:khatauser.isEncrypted,username:user.Fname});
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
    if(!user)
    {
        res.status(401).send("user not present")
    }
    else if((user)&& await bcrypt.compare(password,user.Password) )
    {
        const token = await jwt.sign(
            {id:user._id},
             key,     // have to use process.env.key(whatever u want to provide) its basically secure and industry standard
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
        res.status(401).send("Password incorrect")
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
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const khatauser = await khataModel.findOne({
            $and: [{ userid: id }, { 'khata.date': date }]
        });

            res.render("addkhata")

    }catch(err){
        res.status(400)
    }
    

})
app.post('/ADDKhata',auth, async (req, res) => {
    const data = req.body.data;
    const kname = req.body.khataname;
    const now = new Date();
    const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
    const tokenFromCookie = req.cookies.token;
    const verification = jwt.verify(tokenFromCookie, key);
    const id = verification.id;
    const isEncrypted= req.body.enc
    if(isEncrypted){
        await khataModel.updateOne(
            { userid: id},
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

app.get("/viewkhata/:id",auth,async(req,res)=>
{
    const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const khataid= req.params.id
        const user = await khataModel.findOne(
            { userid:id, 'khata._id': khataid },  // Match the user and the specific khata element
            { 'khata.$': 1 }  // Retrieve only the matching khata element
        );      
             res.render("viewkhata",{date:user.khata[0].date,title:user.khata[0].khataname,data:user.khata[0].data,isEncrypted:user.khata[0].isEncrypted,id:user.khata[0]._id})
        }
})
app.post("/viewkhata/:id",auth,async(req,res)=>
{
    const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const khataid= req.params.id
        const pass= req.body.pass
        const user= await userModel.findOne({_id:id})
        const isvalid=await bcrypt.compare(pass,user.Password)
        if(isvalid)
        {
            res.redirect(`/viewkhata/${khataid}`)
        }
        else{
            res.status(401).send("incorrect password....try again to view khata")
        }
        }
})
app.get("/editkhata/:id",auth,async(req,res)=>
{
    const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const khataid= req.params.id
        const user = await khataModel.findOne(
            { userid:id, 'khata._id': khataid },  // Match the user and the specific khata element
            { 'khata.$': 1 }  // Retrieve only the matching khata element
        );
        res.render("edit",{data:user.khata[0].data,date:user.khata[0].date,title:user.khata[0].khataname,isEncrypted:user.khata[0].isEncrypted,id:user.khata[0]._id})
       } 
})
app.get("/deletekhata/:id",auth,async(req,res)=>
    {   
       const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const date= req.params.date
        const khataid = req.params.id
        await khataModel.updateOne(
         { userid: id },
         {
             $pull: {
                 khata: {_id:khataid}
             }
         }
       );

       }
    res.redirect("/")
})

app.post("/updatekhata/:id",auth,async(req,res)=>
    {
       const tokenFromCookie = req.cookies.token;
       if(tokenFromCookie)
       {
        const verification = jwt.verify(tokenFromCookie, key);
        const id = verification.id;
        const khataid= req.params.id
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
        // const user= await khataModel.findOne({userid:id,'khata._id':id},{ 'khata.$': 1 })

        await khataModel.updateOne(
            {userid:id,'khata._id':khataid},

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


app.listen(PORT)
