import * as React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: (string | undefined | false)[]) {
    return twMerge(clsx(inputs));
}

export function Card({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "rounded-[var(--radius)]",
                "border border-[var(--border)]",
                "bg-[var(--surface)]",
                "shadow-[var(--shadow-sm)]",
                "transition-all duration-200",
                "hover:shadow-[var(--shadow)]",
                className
            )}
            {...props}
        />
    );
}

export function CardHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("flex flex-col gap-2 p-6 md:p-8 pb-4 md:pb-4", className)}
            {...props}
        />
    );
}

export function CardTitle({
    className,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3
            className={cn(
                "text-[18px] font-semibold tracking-tight text-[var(--foreground)]",
                className
            )}
            {...props}
        />
    );
}

export function CardDescription({
    className,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p
            className={cn(
                "text-[14px] leading-relaxed text-[var(--muted-foreground)]",
                className
            )}
            {...props}
        />
    );
}

export function CardContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn("px-6 md:px-8 pb-6 md:pb-8", className)} {...props} />;
}

export function CardFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                "flex items-center justify-end gap-3",
                "border-t border-[var(--border)] bg-[var(--surface-secondary)]/30",
                "px-6 md:px-8 py-4 md:py-5",
                className
            )}
            {...props}
        />
    );
}