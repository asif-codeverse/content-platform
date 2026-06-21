import nodemailer from "nodemailer";
import { env } from "../config/env.js";

const transporter =
    nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: env.EMAIL_USER,
            pass: env.EMAIL_PASS,
        },
    });

export const sendVerificationOtp =
    async (email, otp) => {

        await transporter.sendMail({
            from: env.EMAIL_USER,
            to: email,
            subject:
                "Verify Your Email",

            html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
        });
    };