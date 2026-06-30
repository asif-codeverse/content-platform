import { Loader2 } from "lucide-react";

type Props = {
    text?: string;
    className?: string;
};

export default function LoadingSpinner({
    text = "Loading...",
    className = "",
}: Props) {
    return (
        <div
            className={`
                flex
                min-h-[320px]
                flex-col
                items-center
                justify-center
                gap-4
                ${className}
            `}
        >
            <Loader2
                size={28}
                className="
                    animate-spin
                    text-[var(--muted-foreground)]
                "
                strokeWidth={2}
            />

            {text && (
                <p
                    className="
                        text-[13px]
                        font-medium
                        text-[var(--muted-foreground)]
                    "
                >
                    {text}
                </p>
            )}
        </div>
    );
}