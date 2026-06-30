"use client";

import type { ButtonHTMLAttributes } from "react";

import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "rounded-[var(--radius-sm)]",
    "px-4 py-2",
    "text-[14px] font-medium",
    "transition-all duration-200",
    "select-none",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-[var(--ring)]",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-[var(--background)]",
    "active:scale-[0.97]",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[var(--shadow-sm)] hover:bg-[var(--primary)]/90 hover:shadow-[var(--shadow)] hover:-translate-y-[0.5px]",

        secondary:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--shadow-xs)] hover:bg-[var(--surface-secondary)] hover:border-[var(--border-strong)] hover:-translate-y-[0.5px]",

        ghost:
          "bg-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--surface-secondary)]",

        danger:
          "bg-[var(--danger)] text-white shadow-[var(--shadow-sm)] hover:opacity-90 hover:shadow-[var(--shadow)] hover:-translate-y-[0.5px]",
        success:
          "bg-emerald-600 text-white shadow-[var(--shadow-sm)] hover:bg-emerald-700",

        indigo:
          "bg-indigo-600 text-white shadow-[var(--shadow-sm)] hover:bg-indigo-700",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[13px]",
        lg: "h-12 px-6 text-[15px]",
        icon: "h-10 w-10 p-0",
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

function cn(...inputs: (string | undefined | false)[]) {
  return twMerge(clsx(inputs));
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean;
  };

export default function Button({
  children,
  loading = false,
  variant,
  size,
  className,
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  );
}