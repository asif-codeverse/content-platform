import type { ReactNode } from "react";
import { Search } from "lucide-react";

type Props = {
    title: string;
    description: string;
    icon?: string | ReactNode;
    action?: ReactNode;
};

export default function EmptyState({
    title,
    description,
    icon,
    action,
}: Props) {
    const renderedIcon =
        typeof icon === "string" ? (
            <span className="text-3xl md:text-4xl">{icon}</span>
        ) : (
            icon ?? <Search size={24} strokeWidth={2} />
        );

    return (
        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                rounded-[var(--radius-lg)]
                border
                border-dashed
                border-[var(--border)]
                bg-[var(--surface)]
                px-6
                md:px-8
                py-16
                md:py-24
                text-center
            "
        >
            <div
                className="
                    mb-6
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--surface-secondary)]
                    text-[var(--muted-foreground)]
                    border
                    border-[var(--border)]
                "
            >
                {renderedIcon}
            </div>

            <h2
                className="
                    text-xl
                    font-semibold
                    tracking-tight
                    text-[var(--foreground)]
                "
            >
                {title}
            </h2>

            <p
                className="
                    mt-2
                    max-w-sm
                    text-[15px]
                    leading-relaxed
                    text-[var(--muted-foreground)]
                "
            >
                {description}
            </p>

            {action && <div className="mt-8">{action}</div>}
        </div>
    );
}