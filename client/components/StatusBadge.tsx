import {
    CheckCircle2,
    Clock3,
    FileEdit,
    XCircle,
    Shield,
    UserCog,
    User,
} from "lucide-react";
type Props = {
    status: string;
};

const variants = {
    DRAFT: {
        label: "Draft",
        className:
            "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900 dark:text-stone-300 dark:border-stone-800",
        icon: FileEdit,
    },

    PENDING: {
        label: "Pending",
        className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
        icon: Clock3,
    },

    PUBLISHED: {
        label: "Published",
        className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
        icon: CheckCircle2,
    },

    REJECTED: {
        label: "Rejected",
        className:
            "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
        icon: XCircle,
    },

    ADMIN: {
        label: "Admin",
        className:
            "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
        icon: Shield,
    },

    EDITOR: {
        label: "Editor",
        className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
        icon: UserCog,
    },

    USER: {
        label: "User",
        className:
            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        icon: User,
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