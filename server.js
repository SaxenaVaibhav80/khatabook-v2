const express= require("express")
const app= express()
const db = require("./config/config")

app.get("/",(req,res)=>
{
    res.send("working")
})
app.listen(3000,()=>
{
    console.log("server running.......")
})