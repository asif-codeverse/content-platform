export default function LoadingSpinner({
    text = "Loading...",
}: {
    text?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16">

            <div
                className="
                    h-10
                    w-10
                    animate-spin
                    rounded-full
                    border-4
                    border-gray-300
                    border-t-blue-600
                "
            />

            <p className="mt-4 text-gray-500">
                {text}
            </p>

        </div>
    );
}