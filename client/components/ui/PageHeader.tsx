import type { ReactNode } from "react";

type Props = {
    title: string;
    description?: string;
    actions?: ReactNode;
};

export default function PageHeader({
    title,
    description,
    actions,
}: Props) {
    return (
        <header
            className="
                mb-10
                flex
                flex-col
                gap-6
                border-b
                border-[var(--border)]
                pb-6
                md:flex-row
                md:items-end
                md:justify-between
            "
        >
            <div className="max-w-2xl">
                <h1
                    className="
                        text-3xl
                        font-bold
                        tracking-tighter
                        text-[var(--foreground)]
                    "
                >
                    {title}
                </h1>

                {description && (
                    <p
                        className="
                            mt-2
                            text-[15px]
                            leading-relaxed
                            text-[var(--muted-foreground)]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>

            {actions && (
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                        md:justify-end
                    "
                >
                    {actions}
                </div>
            )}
        </header>
    );
}