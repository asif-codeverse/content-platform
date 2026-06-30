"use client";

import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error;
    reset: () => void;
}) {
    return (
        <main
            className="
                flex
                min-h-[70vh]
                items-center
                justify-center
                px-6
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
                    p-8
                    md:p-10
                    text-center
                    shadow-[var(--shadow-sm)]
                    flex
                    flex-col
                    items-center
                "
            >
                <div
                    className="
                        mb-6
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-red-500/10
                        border
                        border-red-500/20
                        text-red-600
                        dark:text-red-400
                    "
                >
                    <AlertTriangle size={20} strokeWidth={2} />
                </div>

                <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
                    Something went wrong
                </h1>

                <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted-foreground)]">
                    {error.message || "An unexpected error occurred."}
                </p>

                <Button className="mt-8 w-full" onClick={reset}>
                    Try Again
                </Button>
            </div>
        </main>
    );
}