import { useEffect } from "react";

export default function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = "Confirm",
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}) {
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onCancel();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onCancel]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                className="relative w-full max-w-sm rounded-lg border border-border bg-surface p-5 shadow-xl dark:border-border-dark dark:bg-surface-dark"
            >
                <h2
                    id="confirm-dialog-title"
                    className="font-display text-lg font-semibold text-ink dark:text-ink-dark"
                >
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-sm text-ink-soft dark:text-ink-dark-soft">
                        {description}
                    </p>
                )}
                <div className="mt-5 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-black/5 dark:text-ink-dark-soft dark:hover:bg-white/10"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`rounded-md px-3 py-2 text-sm font-medium text-white transition-colors disabled:opacity-60 ${
                            danger
                                ? "bg-red-600 hover:bg-red-600/90"
                                : "bg-emerald-700 hover:bg-emerald-700/90"
                        }`}
                    >
                        {loading ? "Working…" : confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
