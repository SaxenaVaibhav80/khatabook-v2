const mongoose = require("mongoose")
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL);

const db = mongoose.connection


db.on("open",()=>
{
    console.log("DB connected")
})

module.exports=db


