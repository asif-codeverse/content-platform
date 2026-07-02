"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Info } from "lucide-react";

import Button from "./Button";

type Props = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    danger?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
};

export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    description = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    loading = false,
    danger = true,
    onConfirm,
    onCancel,
}: Props) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-[var(--background)]/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            y: 10,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: [0.16, 1, 0.3, 1], // Custom smooth ease
                        }}
                        className="
                            fixed
                            left-1/2
                            top-1/2
                            z-50
                            w-[calc(100%-2rem)]
                            sm:w-full
                            max-w-md
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-[var(--radius-dialog)]
                            border
                            border-[var(--border)]
                            bg-[var(--surface)]
                            p-6
                            shadow-[var(--shadow-lg)]
                        "
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    ${danger ? "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400" : "bg-[var(--surface-secondary)] border-[var(--border)] text-[var(--foreground)]"}
                                `}
                            >
                                {danger ? (
                                    <AlertTriangle size={18} strokeWidth={2.5} />
                                ) : (
                                    <Info size={18} strokeWidth={2.5} />
                                )}
                            </div>

                            <div className="flex-1 pt-1">
                                <h2
                                    className="
                                        text-[17px]
                                        font-semibold
                                        tracking-tight
                                        text-[var(--foreground)]
                                    "
                                >
                                    {title}
                                </h2>

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
                        </div>

                        <div
                            className="
                                mt-8
                                flex
                                justify-end
                                gap-3
                            "
                        >
                            <Button variant="secondary" onClick={onCancel}>
                                {cancelText}
                            </Button>

                            <Button
                                loading={loading}
                                variant={danger ? "danger" : "primary"}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}