import Button from "@/components/ui/Button";

type Props = {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
};

export default function Pagination({
    page,
    totalPages,
    onPrevious,
    onNext,
}: Props) {
    if (totalPages <= 1) return null;

    return (
        <div
            className="
                mt-12
                flex
                items-center
                justify-between
                py-4
            "
        >
            <Button
                variant="secondary"
                disabled={page === 1}
                onClick={onPrevious}
                className="w-[100px]"
            >
                Previous
            </Button>

            <span
                className="
                    text-[14px]
                    font-medium
                    text-[var(--muted-foreground)]
                "
            >
                Page {page} of {totalPages}
            </span>

            <Button
                variant="secondary"
                disabled={page >= totalPages}
                onClick={onNext}
                className="w-[100px]"
            >
                Next
            </Button>
        </div>
    );
}