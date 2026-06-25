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

export const sendMail = async ({
    to,
    subject,
    html,
}) => {

    await transporter.sendMail({

        from: env.EMAIL_USER,

        to,

        subject,

        html,

    });

};

export const sendVerificationOtp =
    async (email, otp) => {

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

export const sendPasswordResetOtp =
    async (email, otp) => {

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

