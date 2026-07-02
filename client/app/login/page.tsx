"use client";

import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

import { LogIn } from "lucide-react";

import { loginUser } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function LoginPage() {
    const router = useRouter();
    const { refreshUser } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const result = await loginUser(email, password);
            localStorage.setItem("accessToken", result.accessToken);

            await refreshUser();
            router.push("/");
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
                        <LogIn size={20} strokeWidth={2} />
                    </div>

                    <h1
                        className="
                            text-2xl
                            font-semibold
                            tracking-tight
                            text-[var(--foreground)]
                        "
                    >
                        Welcome back
                    </h1>

                    <p
                        className="
                            mt-2
                            text-[14px]
                            text-[var(--muted-foreground)]
                        "
                    >
                        Enter your credentials to access your account
                    </p>
                </div>

                <Toast
                    message={error}
                    type="error"
                    onClose={() => setError("")}
                />

                <form onSubmit={handleSubmit} className="space-y-5">
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
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <div className="flex items-center justify-between">
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

                            <Link
                                href="/forgot-password"
                                className="
                                    text-[12px]
                                    font-medium
                                    text-[var(--muted-foreground)]
                                    hover:text-[var(--foreground)]
                                    transition-colors
                                "
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
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

                    <Button
                        type="submit"
                        loading={loading}
                        className="w-full mt-2 h-11 text-[15px]"
                    >
                        Sign In
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
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/register"
                        className="
                            font-medium
                            text-[var(--foreground)]
                            hover:underline
                            transition-colors
                        "
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}