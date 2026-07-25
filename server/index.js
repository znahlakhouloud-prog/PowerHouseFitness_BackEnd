import express from "express";
import db from "./config/database.js";



const app = express()


app.use(express.json())

app.listen(3000, ()=>{
    console.log("Server is running")
})