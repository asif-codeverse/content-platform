"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { MailCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown <= 0) return;
        const timer = setInterval(() => {
            setCooldown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [cooldown]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`,
                { email, otp }
            );

            setError("");
            setMessage("Email verified successfully. Redirecting to sign in...");

            setTimeout(() => {
                router.push("/login");
            }, 1500);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMessage("");
                setError(err.response?.data?.message ?? "Something went wrong.");
            } else {
                setError("Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-verification`,
                { email }
            );

            setCooldown(60);
            setError("");
            setMessage(
                "A new verification code has been sent. If you don't see it, please check your Spam or Junk folder."
            );
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setMessage("");
                setError(err.response?.data?.message ?? "Something went wrong.");
            } else {
                setError("Something went wrong.");
            }
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
                        <MailCheck size={20} strokeWidth={2} />
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                        Verify Your Email
                    </h1>

                    <p className="mt-2 text-[14px] text-[var(--muted-foreground)]">
                        Enter the 6-digit verification code sent to
                    </p>

                    <p className="mt-1 text-[14px] font-medium text-[var(--foreground)]">
                        {email}
                    </p>

                    <div
                        className="
        mt-6
        w-full
        rounded-[var(--radius)]
        border
        border-[var(--border)]
        bg-[var(--surface-secondary)]
        p-4
        text-left
    "
                    >
                        <h2 className="text-sm font-semibold text-[var(--foreground)]">
                            Can&#39;t find the email?
                        </h2>

                        <ul className="mt-3 space-y-2 text-sm text-[var(--muted-foreground)]">
                            <li>• Check your Spam or Junk folder.</li>
                            <li>• Delivery may take up to 2 minutes.</li>
                            <li>• Verify that the email address above is correct.</li>
                            <li>• You can request a new code after 60 seconds.</li>
                        </ul>
                    </div>
                </div>



                <Toast message={error} type="error" onClose={() => setError("")} />
                <Toast message={message} type="success" onClose={() => setMessage("")} />

                <form onSubmit={handleVerify} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="otp"
                            className="text-[13px] font-medium text-[var(--foreground)]"
                        >
                            Verification Code
                        </label>

                        <input
                            id="otp"
                            type="text"
                            maxLength={6}
                            inputMode="numeric"
                            placeholder="123456"
                            value={otp}
                            onChange={(e) =>
                                setOtp(e.target.value.replace(/\D/g, ""))
                            }
                            className="
                                w-full
                                rounded-[var(--radius-sm)]
                                border
                                border-[var(--border)]
                                bg-[var(--background)]
                                px-4
                                py-3
                                text-center
                                text-lg
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

                    <Button
                        type="submit"
                        loading={loading}
                        disabled={otp.length !== 6}
                        className="w-full mt-2 h-11 text-[15px]"
                    >
                        Verify Email
                    </Button>

                    <Button
                        type="button"
                        variant="secondary"
                        disabled={cooldown > 0}
                        onClick={handleResend}
                        className="w-full"
                    >
                        {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </Button>
                </form>
            </div>
        </main>
    );
}