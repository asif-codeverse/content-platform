"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { KeyRound } from "lucide-react";

import {
    forgotPassword,
    resetPassword,
} from "@/services/auth.service";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);
            await forgotPassword(email);
            setMessage("Check your email for the password reset OTP.");
            setStep(2);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong.");
            } else {
                setError("Something went wrong.");
            }
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
            setMessage("OTP resent successfully.");
            setCooldown(60);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters");
            return;
        }
        if (!otp.trim()) {
            setError("OTP is required");
            return;
        }

        try {
            setLoading(true);
            await resetPassword(email, otp, password);
            setMessage("Password reset successfully.");
            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message ?? "Something went wrong.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main
            className="
                flex
                min-h-screen
                items-center
                justify-center
                bg-[var(--background)]
                px-4
                sm:px-6
                py-12
            "
        >
            <div
                className="
                    w-full
                    max-w-[400px]
                    rounded-[var(--radius-lg)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    sm:p-8
                    md:p-10
                    shadow-[var(--shadow-sm)]
                "
            >
                <div className="mb-8 text-center flex flex-col items-center">
                    <div
                        className="
                            mb-6
                            flex
                            h-12
                            w-12
                            items-center
                            justify-center
                            rounded-xl
                            bg-[var(--surface-secondary)]
                            border
                            border-[var(--border)]
                            text-[var(--foreground)]
                        "
                    >
                        <KeyRound size={20} strokeWidth={2} />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Forgot Password
                    </h1>

                    <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
                        {step === 1
                            ? "We'll send an OTP to your email"
                            : "Enter the OTP and choose a new password"}
                    </p>
                </div>

                <Toast message={error} type="error" onClose={() => setError("")} />
                <Toast message={message} type="success" onClose={() => setMessage("")} />

                {step === 1 && (
                    <form onSubmit={handleSendOtp} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-[var(--foreground)]">
                                Email
                            </label>
                            <input
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="
                                    w-full
                                    rounded-[var(--radius-sm)]
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-4
                                    py-2.5
                                    text-[14px]
                                    outline-none
                                    transition-all
                                    duration-200
                                    placeholder:text-[var(--muted)]
                                    hover:border-[var(--border-strong)]
                                    focus:border-[var(--border)]
                                    focus:bg-[var(--surface)]
                                    focus:ring-2
                                    focus:ring-[var(--ring)]
                                    focus:ring-offset-1
                                    focus:ring-offset-[var(--background)]
                                "
                                required
                            />
                        </div>

                        <Button type="submit" loading={loading} className="w-full h-11 text-[15px]">
                            Send OTP
                        </Button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-[var(--foreground)]">
                                Verification Code
                            </label>
                            <input
                                type="text"
                                maxLength={6}
                                inputMode="numeric"
                                value={otp}
                                placeholder="123456"
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="
                                    w-full
                                    rounded-[var(--radius-sm)]
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-4
                                    py-2.5
                                    text-[14px]
                                    text-center
                                    tracking-[0.5em]
                                    outline-none
                                    transition-all
                                    duration-200
                                    placeholder:text-[var(--muted)]
                                    hover:border-[var(--border-strong)]
                                    focus:border-[var(--border)]
                                    focus:bg-[var(--surface)]
                                    focus:ring-2
                                    focus:ring-[var(--ring)]
                                    focus:ring-offset-1
                                    focus:ring-offset-[var(--background)]
                                "
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-[var(--foreground)]">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="
                                    w-full
                                    rounded-[var(--radius-sm)]
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-4
                                    py-2.5
                                    text-[14px]
                                    outline-none
                                    transition-all
                                    duration-200
                                    placeholder:text-[var(--muted)]
                                    hover:border-[var(--border-strong)]
                                    focus:border-[var(--border)]
                                    focus:bg-[var(--surface)]
                                    focus:ring-2
                                    focus:ring-[var(--ring)]
                                    focus:ring-offset-1
                                    focus:ring-offset-[var(--background)]
                                "
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-[var(--foreground)]">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="
                                    w-full
                                    rounded-[var(--radius-sm)]
                                    border
                                    border-[var(--border)]
                                    bg-[var(--background)]
                                    px-4
                                    py-2.5
                                    text-[14px]
                                    outline-none
                                    transition-all
                                    duration-200
                                    placeholder:text-[var(--muted)]
                                    hover:border-[var(--border-strong)]
                                    focus:border-[var(--border)]
                                    focus:bg-[var(--surface)]
                                    focus:ring-2
                                    focus:ring-[var(--ring)]
                                    focus:ring-offset-1
                                    focus:ring-offset-[var(--background)]
                                "
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            loading={loading}
                            disabled={otp.length !== 6}
                            className="w-full mt-2 h-11 text-[15px]"
                        >
                            Reset Password
                        </Button>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setStep(1);
                                    setCooldown(0);
                                    setOtp("");
                                    setPassword("");
                                    setConfirmPassword("");
                                    setError("");
                                    setMessage("");
                                }}
                                className="w-full"
                            >
                                Change Email
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                disabled={loading || cooldown > 0 || !email.trim()}
                                onClick={handleResendOtp}
                                className="w-full"
                            >
                                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </main>
    );
}