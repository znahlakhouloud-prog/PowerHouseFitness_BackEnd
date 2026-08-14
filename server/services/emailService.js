import transporter from "../config/email.js";

export const sendPasswordResetEmail = async (
    email,
    resetToken
) => {

    const resetLink =
        `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({

        from:
            `"PowerHouse Fitness" <${process.env.SMTP_USER}>`,

        to: email,

        subject:
            "Reset Your PowerHouse Fitness Password",

        text: `
Hello,

We received a request to reset your PowerHouse Fitness password.

Use the following link to reset your password:

${resetLink}

This link will expire in 15 minutes.

If you did not request a password reset, you can safely ignore this email.

PowerHouse Fitness
        `,

        html: `
            <div
                style="
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: auto;
                    padding: 20px;
                "
            >

                <h2>PowerHouse Fitness</h2>

                <p>
                    We received a request to reset your password.
                </p>

                <p>
                    Click the button below to reset your password:
                </p>

                <a
                    href="${resetLink}"
                    style="
                        display: inline-block;
                        padding: 12px 20px;
                        background: #000;
                        color: #fff;
                        text-decoration: none;
                        border-radius: 5px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link will expire in
                    <strong>15 minutes</strong>.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <p>
                    PowerHouse Fitness
                </p>

            </div>
        `
    });
};