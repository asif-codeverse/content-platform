"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import {
    forgotPassword,
    resetPassword,
} from "@/services/auth.service";

export default function ForgotPasswordPage() {

    const router = useRouter();

    const [step, setStep] =
        useState(1);

    const [email, setEmail] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");
    const [cooldown, setCooldown] =
        useState(0);
    useEffect(() => {

        if (cooldown <= 0) return;

        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);

    }, [cooldown]);

    const handleSendOtp =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();

            setError("");
            setMessage("");
            if (!email.trim()) {

                setError(
                    "Email is required"
                );

                return;
            }
            try {

                setLoading(true);

                await forgotPassword(
                    email
                );

                setMessage(
                    "Check your email for the password reset OTP"
                );

                setStep(2);

            } catch (error: any) {

                setError(
                    error.response?.data?.message
                );

            } finally {

                setLoading(false);

            }

        };

    const handleResendOtp = async () => {

        setError("");
        setMessage("");
        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {

            setLoading(true);

            await forgotPassword(email);

            setMessage("OTP resent successfully");
            setCooldown(60);

        } catch (error: any) {

            setError(
                error.response?.data?.message
            );

        } finally {

            setLoading(false);

        }
    };

    const handleResetPassword =
        async (
            e: React.FormEvent
        ) => {

            e.preventDefault();

            setError("");
            setMessage("");

            if (
                password !==
                confirmPassword
            ) {

                setError(
                    "Passwords do not match"
                );

                return;

            }
            if (password.length < 8) {

                setError(
                    "Password must be at least 8 characters"
                );

                return;
            }
            if (!otp.trim()) {

                setError(
                    "OTP is required"
                );

                return;
            }
            try {

                setLoading(true);

                await resetPassword(
                    email,
                    otp,
                    password
                );

                setMessage(
                    "Password reset successfully"
                );

                setTimeout(() => {

                    router.push("/login");

                }, 1500);

            } catch (error: any) {

                setError(
                    error.response?.data?.message
                );

            } finally {

                setLoading(false);

            }

        };
    return (
        <main className="max-w-md mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">
                Forgot Password
            </h1>

            {message && (
                <p className="text-green-600 mb-4">
                    {message}
                </p>
            )}

            {error && (
                <p className="text-red-500 mb-4">
                    {error}
                </p>
            )}
            {step === 1 && (
                <form
                    onSubmit={handleSendOtp}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="email"
                        placeholder="Email"
                        required
                        autoComplete="email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <button
                        disabled={loading}
                        type="submit"
                    >
                        {
                            loading
                                ? "Sending..."
                                : "Send OTP"
                        }
                    </button>

                </form>
            )}

            {step === 2 && (
                <form
                    onSubmit={handleResetPassword}
                    className="flex flex-col gap-4"
                >

                    <input
                        type="text"
                        maxLength={6}
                        inputMode="numeric"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) =>
                            setOtp(
                                e.target.value.replace(/\D/g, "")
                            )
                        }
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setPassword(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        autoComplete="new-password"
                        onChange={(e) =>
                            setConfirmPassword(
                                e.target.value
                            )
                        }
                    />

                    <button
                        disabled={
                            loading ||
                            otp.length !== 6
                        }
                        type="submit"
                    >
                        {
                            loading
                                ? "Resetting..."
                                : "Reset Password"
                        }
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setMessage("");
                            setError("");
                            setCooldown(0);
                            setOtp("");
                            setPassword("");
                            setConfirmPassword("");
                        }}
                    >
                        Change Email
                    </button>
                    <button
                        type="button"
                        disabled={
                            loading ||
                            cooldown > 0 ||
                            !email.trim()
                        }
                        onClick={handleResendOtp}
                    >
                        {
                            loading
                                ? "Sending..."
                                : cooldown > 0
                                    ? `Resend in ${cooldown}s`
                                    : "Resend OTP"
                        }
                    </button>

                </form>
            )}
        </main>
    );
}