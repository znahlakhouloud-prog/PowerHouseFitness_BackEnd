import dotenv from "dotenv";
dotenv.config();

import express from "express";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";

const app = express();


app.use(express.json());
app.use("/users",userRoutes);
app.use("/auth",authRoutes);
app.use("/memberships",membershipRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

