export default function StatusTag({ available, stockQuantity }) {
    const inStock = available && stockQuantity > 0;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded font-mono text-[11px] font-medium tracking-wide ${
                inStock
                    ? "text-emerald-700 dark:text-emerald-300"
                    : "text-red-600 dark:text-red-400"
            }`}
        >
            <span
                className={`h-1.5 w-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`}
                aria-hidden="true"
            />
            {inStock ? `IN STOCK · ${stockQuantity}` : "OUT OF STOCK"}
        </span>
    );
}
