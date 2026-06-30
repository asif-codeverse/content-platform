type Props = {
    name: string;
    role: string;
};

export default function DashboardHero({ name, role }: Props) {
    return (
        <section className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] pb-8">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--foreground)]">
                    Dashboard
                </h1>

                <p className="mt-3 text-[15px] leading-relaxed text-[var(--muted-foreground)]">
                    Welcome back,{" "}
                    <span className="font-semibold text-[var(--foreground)]">{name}</span>
                </p>
            </div>

            <span
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
                {role}
            </span>
        </section>
    );
}