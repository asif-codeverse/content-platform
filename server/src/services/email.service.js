import axios from "axios";
import { env } from "../config/env.js";

export const sendMail = async ({
    to,
    subject,
    html,
}) => {

    await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: {
                name: "Content Platform",
                email: env.EMAIL_FROM,
            },

            to: [
                {
                    email: to,
                },
            ],

            subject,

            htmlContent: html,
        },
        {
            headers: {
                "api-key": env.BREVO_API_KEY,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            timeout: 30000,
        }
    );

};

export const sendVerificationOtp = async (
    email,
    otp
) => {

    await sendMail({
        to: email,
        subject: "Verify Your Email",
        html: `
            <h2>Email Verification</h2>

            <p>Your OTP is:</p>

            <h1>${otp}</h1>

            <p>Valid for 10 minutes.</p>
        `,
    });

};

export const sendPasswordResetOtp = async (
    email,
    otp
) => {

    await sendMail({
        to: email,
        subject: "Password Reset OTP",
        html: `
            <h2>Password Reset</h2>

            <p>Your password reset OTP is:</p>

            <h1>${otp}</h1>

            <p>Valid for 10 minutes.</p>
        `,
    });

};