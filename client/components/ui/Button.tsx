"use client";

import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;

  variant?:
  | "primary"
  | "success"
  | "danger"
  | "indigo"
  | "secondary";
};

export default function Button({
  children,
  loading = false,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: Props) {
  const variants = {

    primary:
      "bg-blue-600 enabled:hover:bg-blue-700",

    success:
      "bg-green-600 enabled:hover:bg-green-700",

    danger:
      "bg-red-600 enabled:hover:bg-red-700",

    indigo:
      "bg-indigo-600 enabled:hover:bg-indigo-700",

    secondary:
      "bg-gray-200 text-gray-800 enabled:hover:bg-gray-300",

  };
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`
  rounded-lg
  px-4
  py-2
  font-medium
  transition
  disabled:opacity-50
  disabled:cursor-not-allowed
  ${variants[variant]}
  ${className}
`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}