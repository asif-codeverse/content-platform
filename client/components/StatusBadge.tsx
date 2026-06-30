import { CheckCircle2, Clock3, FileEdit, XCircle } from "lucide-react";

type Props = {
    status: string;
};

const variants = {
    DRAFT: {
        label: "Draft",
        className: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800",
        icon: FileEdit,
    },
    PENDING: {
        label: "Pending",
        className: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        icon: Clock3,
    },
    PUBLISHED: {
        label: "Published",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        icon: CheckCircle2,
    },
    REJECTED: {
        label: "Rejected",
        className: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
        icon: XCircle,
    },
} as const;

export default function StatusBadge({ status }: Props) {
    const badge = variants[status as keyof typeof variants] ?? variants.DRAFT;
    const Icon = badge.icon;

    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-md
                border
                px-2.5
                py-1
                text-[12px]
                font-medium
                transition-all
                ${badge.className}
            `}
        >
            <Icon size={14} strokeWidth={2.5} />
            {badge.label}
        </span>
    );
}