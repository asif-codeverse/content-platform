"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
};

export default function Button({
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
        rounded-lg
        bg-blue-600
        px-4
        py-2
        text-white
        font-medium
        transition
        hover:bg-blue-700
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}