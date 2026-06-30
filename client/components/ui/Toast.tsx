"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

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

    const success = type === "success";

    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="
                        mb-4
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-[var(--radius-sm)]
                        border
                        border-[var(--border)]
                        bg-[var(--surface)]
                        px-4
                        py-3
                        shadow-[var(--shadow-sm)]
                    "
                >
                    <div className="flex items-center gap-3">
                        {success ? (
                            <CheckCircle2
                                size={18}
                                strokeWidth={2.5}
                                className="text-[var(--success)]"
                            />
                        ) : (
                            <XCircle
                                size={18}
                                strokeWidth={2.5}
                                className="text-[var(--danger)]"
                            />
                        )}

                        <p
                            className="
                                text-[13px]
                                font-medium
                                text-[var(--foreground)]
                            "
                        >
                            {message}
                        </p>
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="
                                rounded-md
                                p-1
                                text-[var(--muted-foreground)]
                                transition-colors
                                hover:bg-[var(--surface-secondary)]
                                hover:text-[var(--foreground)]
                            "
                            aria-label="Close notification"
                        >
                            <X size={14} strokeWidth={2} />
                        </button>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
}