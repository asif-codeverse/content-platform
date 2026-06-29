"use client";

import { useEffect } from "react";

type Props = {
    message: string;
    type?: "success" | "error";
    onClose?: () => void;
};

export default function Toast({
    message,
    type = "success",
    onClose,
}: Props) {

    useEffect(() => {

        if (!message) return;

        const timer = setTimeout(() => {
            onClose?.();
        }, 3000);

        return () => clearTimeout(timer);

    }, [message, onClose]);

    if (!message) return null;

    return (
        <div
            className={`
                mb-4
                rounded-lg
                px-4
                py-3
                text-white
                shadow-md
                transition-all
                duration-300
                ${type === "success"
                    ? "bg-green-600"
                    : "bg-red-600"
                }
            `}
        >
            {message}
        </div>
    );
}