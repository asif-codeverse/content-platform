"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

import { registerUser } from "@/services/auth.service";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");
            setMessage("");

            await registerUser(name, email, password);

            setMessage("Verification OTP sent to your email.");

            router.push(`/verify-email?email=${email}`);
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
                        <UserPlus size={20} strokeWidth={2} />
                    </div>

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-[var(--foreground)]
                        "
                    >
                        Create an account
                    </h1>

                    <p
                        className="
                            mt-2
                            text-[14px]
                            text-[var(--muted-foreground)]
                        "
                    >
                        Join the platform and start publishing
                    </p>
                </div>

                <Toast
                    message={error}
                    type="error"
                    onClose={() => setError("")}
                />

                <Toast
                    message={message}
                    type="success"
                    onClose={() => setMessage("")}
                />

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--foreground)]
                            "
                        >
                            Full Name
                        </label>

                        <input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Doe"
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
                        <label
                            htmlFor="email"
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--foreground)]
                            "
                        >
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
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

                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--foreground)]
                            "
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
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
                        className="w-full mt-2 h-11 text-[15px]"
                    >
                        Create Account
                    </Button>
                </form>

                <p
                    className="
                        mt-8
                        text-center
                        text-[13px]
                        text-[var(--muted-foreground)]
                    "
                >
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="
                            font-medium
                            text-[var(--foreground)]
                            hover:underline
                            transition-colors
                        "
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}