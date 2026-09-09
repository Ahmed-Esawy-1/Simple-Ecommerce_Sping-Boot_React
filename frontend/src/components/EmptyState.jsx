export default function EmptyState({ icon: Icon, title, description, action }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-20 text-center dark:border-border-dark">
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-ink-soft dark:bg-white/5 dark:text-ink-dark-soft">
                    <Icon size={22} strokeWidth={1.5} />
                </div>
            )}
            <h3 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                {title}
            </h3>
            {description && (
                <p className="max-w-sm text-sm text-ink-soft dark:text-ink-dark-soft">
                    {description}
                </p>
            )}
            {action}
        </div>
    );
}
