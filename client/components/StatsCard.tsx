"use client";

import { ArrowUpRight } from "lucide-react";

import ScaleIn from "@/components/motion/ScaleIn";

type Props = {
    title: string;
    value: number;
};

export default function StatsCard({ title, value }: Props) {
    return (
        <ScaleIn>
            <div
                className="
                    group
                    relative
                    overflow-hidden
                    rounded-[var(--radius)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-6
                    shadow-[var(--shadow-xs)]
                    transition-all
                    duration-300
                    hover:-translate-y-[2px]
                    hover:shadow-[var(--shadow-sm)]
                    hover:border-[var(--border-strong)]
                "
            >
                {/* Decorative Accent */}
                <div
                    className="
                        absolute
                        right-0
                        top-0
                        h-24
                        w-24
                        rounded-full
                        bg-[var(--accent)]
                        opacity-0
                        blur-[40px]
                        transition-opacity
                        duration-500
                        group-hover:opacity-10
                    "
                />

                <div className="relative z-10 flex items-start justify-between">
                    <div>
                        <p
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--muted-foreground)]
                            "
                        >
                            {title}
                        </p>

                        <h2
                            className="
                                mt-2
                                text-3xl
                                font-bold
                                tracking-tight
                                text-[var(--foreground)]
                            "
                        >
                            {value.toLocaleString()}
                        </h2>
                    </div>

                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-[var(--surface-secondary)]
                            text-[var(--muted-foreground)]
                            border
                            border-[var(--border)]
                            transition-all
                            duration-300
                            group-hover:bg-[var(--foreground)]
                            group-hover:text-[var(--background)]
                            group-hover:border-[var(--foreground)]
                        "
                    >
                        <ArrowUpRight size={18} strokeWidth={2} />
                    </div>
                </div>
            </div>
        </ScaleIn>
    );
}