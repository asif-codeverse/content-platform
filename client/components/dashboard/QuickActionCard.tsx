import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Props = {
    href: string;
    title: string;
    description: string;
    icon: ReactNode;
};

export default function QuickActionCard({
    href,
    title,
    description,
    icon,
}: Props) {
    return (
        <Link
            href={href}
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
                hover:border-[var(--border-strong)]
                hover:shadow-[var(--shadow-sm)]
            "
        >
            <div className="relative z-10 flex items-start justify-between">
                <div
                    className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-[var(--radius-sm)]
                        bg-[var(--surface-secondary)]
                        border
                        border-[var(--border)]
                        text-[var(--muted-foreground)]
                        transition-colors
                        group-hover:bg-[var(--foreground)]
                        group-hover:text-[var(--background)]
                        group-hover:border-[var(--foreground)]
                    "
                >
                    {icon}
                </div>

                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-[var(--muted-foreground)]
                        transition-all
                        duration-300
                        group-hover:translate-x-1
                        group-hover:text-[var(--foreground)]
                    "
                >
                    <ArrowRight size={18} strokeWidth={2} />
                </div>
            </div>

            <div className="relative z-10 mt-6">
                <h3
                    className="
                        text-[17px]
                        font-semibold
                        tracking-tight
                        text-[var(--foreground)]
                    "
                >
                    {title}
                </h3>

                <p
                    className="
                        mt-1.5
                        text-[14px]
                        leading-relaxed
                        text-[var(--muted-foreground)]
                    "
                >
                    {description}
                </p>
            </div>
        </Link>
    );
}