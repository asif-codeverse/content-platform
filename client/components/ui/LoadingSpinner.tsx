type Props = {
    text?: string;
    className?: string;
};

export default function LoadingSpinner({
    text = "Loading...",
    className = "",
}: Props) {
    return (
        <div
            className={`
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                gap-4
                ${className}
            `}
        >
            {/* spinner */}

            <p className="text-gray-500">
                {text}
            </p>
        </div>
    );
}