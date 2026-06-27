type Props = {
    title: string;
    value: number;
};

export default function StatsCard({ title, value, }: Props) {
    return (
        <div
            className="
                border
                rounded-lg
                p-6
                shadow-sm
                bg-white
            "
        >
            <p
                className="
                    text-gray-500
                    text-sm
                "
            >
                {title}
            </p>

            <h2
                className="
                    text-3xl
                    font-bold
                    mt-2
                "
            >
                {value}
            </h2>
        </div>
    );
}