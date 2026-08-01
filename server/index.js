import dotenv from "dotenv";
dotenv.config();

import express from "express";
import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import equipementRoutes from "./routes/equipmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

const app = express();


app.use(express.json());
app.use("/users",userRoutes);
app.use("/auth",authRoutes);
app.use("/memberships",membershipRoutes);
app.use("/payments",paymentRoutes);
app.use("/coaches", coachRoutes);
app.use("/equipments", equipementRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reports", reportRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

