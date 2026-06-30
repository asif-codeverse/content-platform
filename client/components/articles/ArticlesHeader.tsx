type Props = {
    total: number;
};

export default function ArticlesHeader({ total }: Props) {
    return (
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
            <div>
                <h1
                    className="
                        text-4xl
                        md:text-5xl
                        font-bold
                        tracking-tighter
                        text-[var(--foreground)]
                    "
                >
                    Articles
                </h1>

                <p
                    className="
                        mt-4
                        max-w-xl
                        text-[16px]
                        leading-relaxed
                        text-[var(--muted-foreground)]
                    "
                >
                    Browse the latest insights, stories, and updates from our editorial team.
                </p>
            </div>

            <div
                className="
                    inline-flex
                    items-center
                    h-8
                    rounded-full
                    border
                    border-[var(--border)]
                    bg-[var(--surface-secondary)]/50
                    px-3
                    text-[12px]
                    font-medium
                    text-[var(--muted-foreground)]
                    shrink-0
                "
            >
                {total} {total === 1 ? "Article" : "Articles"} Published
            </div>
        </section>
    );
}