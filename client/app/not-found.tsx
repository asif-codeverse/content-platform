import Link from "next/link";
import { Home, SearchX } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
    return (
        <main
            className="
                flex
                min-h-[70vh]
                items-center
                justify-center
                px-6
                py-12
            "
        >
            <div
                className="
                    w-full
                    max-w-[400px]
                    rounded-[var(--radius-lg)]
                    border
                    border-[var(--border)]
                    bg-[var(--surface)]
                    p-8
                    md:p-10
                    text-center
                    shadow-[var(--shadow-sm)]
                    flex
                    flex-col
                    items-center
                "
            >
                <div
                    className="
                        mb-6
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--surface-secondary)]
                        border
                        border-[var(--border)]
                        text-[var(--muted-foreground)]
                    "
                >
                    <SearchX size={20} strokeWidth={2} />
                </div>

                <p className="text-[12px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                    Error 404
                </p>

                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--foreground)]">
                    Page not found
                </h1>

                <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted-foreground)]">
                    The page you&apos;re looking for can&apos;t be found, may have been moved, or the URL is incorrect.
                </p>

                <Link href="/" className="mt-8 w-full block">
                    <Button className="w-full">
                        <span className="flex items-center gap-2">
                            <Home size={16} />
                            Back to Home
                        </span>
                    </Button>
                </Link>
            </div>
        </main>
    );
}