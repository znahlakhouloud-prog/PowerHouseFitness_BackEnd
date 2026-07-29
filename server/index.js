import express from "express";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();


app.use(express.json());
app.use("/users",userRoutes);
app.use("/auth",authRoutes);

app.listen(3000, ()=>{
    console.log("Server is running")
});