"use client";

import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

export default function Table({ children, className = "" }: Props) {
    return (
        <div
            className={`
                overflow-hidden
                rounded-[var(--radius)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[var(--shadow-xs)]
                ${className}
            `}
        >
            <div className="overflow-x-auto">
                <table
                    className="w-full border-collapse text-left text-[14px]"
                >
                    {children}
                </table>
            </div>

            <style jsx>{`
                table :global(thead) {
                    background: var(--surface-secondary);
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                table :global(th) {
                    padding: 1rem 1.5rem;
                    font-size: 0.8125rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: var(--muted-foreground);
                    border-bottom: 1px solid var(--border);
                    white-space: nowrap;
                }

                table :global(td) {
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1px solid var(--border);
                    vertical-align: middle;
                    color: var(--foreground);
                }

                table :global(tbody tr:last-child td) {
                    border-bottom: none;
                }

                table :global(tbody tr) {
                    transition: background 0.2s ease;
                }

                table :global(tbody tr:hover) {
                    background: var(--surface-secondary);
                }
            `}</style>
        </div>
    );
}