import dotenv from "dotenv";
dotenv.config();
console.log("SMTP_USER:", process.env.SMTP_USER);
console.log(
    "SMTP_PASS exists:",
    !!process.env.SMTP_PASS
);

import express from "express";
import cors from "cors";

import "./config/email.js";

import db from "./config/database.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import membershipRoutes from "./routes/membershipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import coachRoutes from "./routes/coachRoutes.js";
import equipementRoutes from "./routes/equipmentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import planRoutes from "./routes/planRoutes.js";


const app = express();


app.use(cors({
    origin :"http://localhost:5173"
}));
app.use(express.json());
app.use("/users",userRoutes);
app.use("/auth",authRoutes);
app.use("/memberships",membershipRoutes);
app.use("/payments",paymentRoutes);
app.use("/coaches", coachRoutes);
app.use("/equipments", equipementRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reports", reportRoutes);
app.use("/attendance", attendanceRoutes);
app.use("/plans", planRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});

