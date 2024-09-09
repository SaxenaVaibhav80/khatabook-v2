const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/khatabook");

const db = mongoose.connection


db.on("open",()=>
{
    console.log("DB connected")
})

module.exports=db


