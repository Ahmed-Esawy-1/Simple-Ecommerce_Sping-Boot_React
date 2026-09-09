// CARD LOADING
export function CardSkeletonGrid({ count = 8 }) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="animate-pulse overflow-hidden rounded-lg border border-border bg-surface dark:border-border-dark dark:bg-surface-dark"
                >
                    <div className="aspect-square bg-black/5 dark:bg-white/5" />
                    <div className="space-y-2 p-4">
                        <div className="h-2.5 w-1/3 rounded bg-black/10 dark:bg-white/10" />
                        <div className="h-3.5 w-2/3 rounded bg-black/10 dark:bg-white/10" />
                        <div className="h-3.5 w-1/2 rounded bg-black/10 dark:bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    );
}
// SPINNER LOADING
export function Spinner({ size = 18 }) {
    return (
        <svg
            className="animate-spin text-current"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
            />
            <path
                d="M22 12a10 10 0 0 0-10-10"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    );
}
