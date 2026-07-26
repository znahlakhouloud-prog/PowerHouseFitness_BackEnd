import express from "express";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";


const app = express();


app.use(express.json());
app.use(userRoutes);

app.listen(3000, ()=>{
    console.log("Server is running")
});