import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

transporter.verify((error) => {

    if (error) {

        console.error(
            "Email server error:",
            error
        );

    } else {

        console.log(
            "Email server is ready"
        );

    }

});

export default transporter;