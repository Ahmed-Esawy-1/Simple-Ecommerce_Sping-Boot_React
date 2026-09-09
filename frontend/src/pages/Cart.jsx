import { useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, Box, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/format";
import { getProductImageUrl } from "../api/productApi";
import { placeOrder } from "../api/orderApi";
import EmptyState from "../components/EmptyState";

export default function Cart() {
    const {
        items,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
    } = useCart();

    const [placed, setPlaced] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // ---- VALIDATION -----------------------------------------------------------
    const validate = () => {
        const next = {};
        if (!customerName.trim()) next.customerName = "Name is required.";
        if (!email.trim()) {
            next.email = "Email is required.";
        } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
            next.email = "Enter a valid email.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // ---- CONFIRM ORDER ----------------------------------------------------------
    const handleConfirm = async () => {
        if (!validate()) return;
        setSubmitting(true);
        setSubmitError("");
        try {
            await placeOrder({
                customerName: customerName.trim(),
                email: email.trim(),
                items,
            });
            setCheckoutOpen(false);
            clearCart();
            setPlaced(true);
        } catch {
            setSubmitError(
                "Couldn't place your order. Check that the backend is running and try again.",
            );
        } finally {
            setSubmitting(false);
        }
    };

    const closeCheckout = () => {
        if (submitting) return;
        setCheckoutOpen(false);
        setErrors({});
        setSubmitError("");
    };

    if (items.length === 0 && !placed) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Your cart is empty"
                description="Add products from the catalog to see them here."
                action={
                    <Link
                        to="/"
                        className="mt-1 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                    >
                        Browse products
                    </Link>
                }
            />
        );
    }

    if (placed) {
        return (
            <EmptyState
                icon={ShoppingBag}
                title="Order placed"
                description="Thanks! Your order has been submitted."
                action={
                    <Link
                        to="/"
                        className="mt-1 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                    >
                        Continue shopping
                    </Link>
                }
            />
        );
    }

    return (
        <div>
            <div className="mb-8 flex items-end justify-between gap-4">
                {/* HEADER */}
                <div>
                    <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                        YOUR ORDER
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                        Cart
                    </h1>
                </div>
                <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm font-medium text-ink-soft transition-colors hover:text-red-600 dark:text-ink-dark-soft dark:hover:text-red-400"
                >
                    Clear cart
                </button>
            </div>

            {/* CONTENT */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* ITEMS */}
                <div className="divide-y divide-border rounded-lg border border-border lg:col-span-2 dark:divide-border-dark dark:border-border-dark">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 p-4"
                        >
                            <Link
                                to={`/products/${item.id}`}
                                className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/5 dark:bg-white/5"
                            >
                                {item.imageName ? (
                                    <img
                                        src={getProductImageUrl(item.id)}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <Box
                                        size={18}
                                        className="text-ink-soft dark:text-ink-dark-soft"
                                    />
                                )}
                            </Link>

                            <Link
                                to={`/products/${item.id}`}
                                className="min-w-0 flex-1 truncate font-display font-medium text-ink hover:text-emerald-700 dark:text-ink-dark dark:hover:text-emerald-300"
                            >
                                {item.name}
                                {item.brand && (
                                    <span className="ml-2 font-body text-xs font-normal text-ink-soft dark:text-ink-dark-soft">
                                        {item.brand}
                                    </span>
                                )}
                            </Link>

                            <div className="flex items-center rounded-md border border-border dark:border-border-dark">
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity - 1,
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark"
                                    aria-label={`Decrease quantity of ${item.name}`}
                                >
                                    <Minus size={13} />
                                </button>
                                <span className="w-6 text-center font-mono text-xs text-ink dark:text-ink-dark">
                                    {item.quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateQuantity(
                                            item.id,
                                            item.quantity + 1,
                                        )
                                    }
                                    className="flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark"
                                    aria-label={`Increase quantity of ${item.name}`}
                                >
                                    <Plus size={13} />
                                </button>
                            </div>

                            <span className="w-20 shrink-0 text-right font-mono text-sm text-ink dark:text-ink-dark">
                                {formatCurrency(item.price * item.quantity)}
                            </span>

                            <button
                                type="button"
                                onClick={() => removeFromCart(item.id)}
                                className="text-ink-soft transition-colors hover:text-red-600 dark:text-ink-dark-soft dark:hover:text-red-400"
                                aria-label={`Remove ${item.name}`}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* SUMMARY */}
                <div className="h-fit rounded-lg border border-border p-5 dark:border-border-dark">
                    <h2 className="font-display text-base font-semibold text-ink dark:text-ink-dark">
                        Order summary
                    </h2>
                    <dl className="mt-4 space-y-2 font-mono text-sm">
                        <div className="flex justify-between">
                            <dt className="text-ink-soft dark:text-ink-dark-soft">
                                Items
                            </dt>
                            <dd className="text-ink dark:text-ink-dark">
                                {totalItems}
                            </dd>
                        </div>
                        <div className="flex justify-between border-t border-border pt-2 text-base font-semibold dark:border-border-dark">
                            <dt className="text-ink dark:text-ink-dark">
                                Total
                            </dt>
                            <dd className="text-ink dark:text-ink-dark">
                                {formatCurrency(totalPrice)}
                            </dd>
                        </div>
                    </dl>
                    <button
                        type="button"
                        onClick={() => setCheckoutOpen(true)}
                        className="mt-5 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                    >
                        Checkout
                    </button>
                </div>
            </div>

            {/* CHECKOUT MODAL */}
            {checkoutOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) closeCheckout();
                    }}
                >
                    <div className="w-full max-w-md rounded-lg border border-border bg-paper shadow-xl dark:border-border-dark dark:bg-paper-dark">
                        {/* HEADER */}
                        <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark">
                            <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                                Confirm your order
                            </h2>
                            <button
                                type="button"
                                onClick={closeCheckout}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/5 hover:text-ink dark:text-ink-dark-soft dark:hover:bg-white/10 dark:hover:text-ink-dark"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* ITEMS + TOTAL */}
                        <div className="max-h-60 overflow-auto border-b border-border px-5 py-4 dark:border-border-dark">
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex items-center justify-between gap-3 text-sm"
                                    >
                                        <span className="min-w-0 truncate text-ink dark:text-ink-dark">
                                            {item.name}
                                            <span className="ml-1.5 font-mono text-xs text-ink-soft dark:text-ink-dark-soft">
                                                × {item.quantity}
                                            </span>
                                        </span>
                                        <span className="shrink-0 font-mono text-ink dark:text-ink-dark">
                                            {formatCurrency(
                                                item.price * item.quantity,
                                            )}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm font-semibold dark:border-border-dark">
                                <span className="text-ink dark:text-ink-dark">
                                    Total
                                </span>
                                <span className="font-mono text-ink dark:text-ink-dark">
                                    {formatCurrency(totalPrice)}
                                </span>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="space-y-4 px-5 py-4">
                            {submitError && (
                                <div className="rounded-md border border-red-600/30 bg-red-600/5 px-3 py-2 text-sm text-red-600 dark:border-red-400/30 dark:text-red-400">
                                    {submitError}
                                </div>
                            )}
                            <div>
                                <label
                                    className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark"
                                    htmlFor="checkout-name"
                                >
                                    Name
                                </label>
                                <input
                                    id="checkout-name"
                                    value={customerName}
                                    onChange={(e) =>
                                        setCustomerName(e.target.value)
                                    }
                                    placeholder="Your full name"
                                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-emerald-700 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-dark-soft/50 dark:focus:border-emerald-400"
                                />
                                {errors.customerName && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.customerName}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label
                                    className="mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark"
                                    htmlFor="checkout-email"
                                >
                                    Email
                                </label>
                                <input
                                    id="checkout-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-emerald-700 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-dark-soft/50 dark:focus:border-emerald-400"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-4 dark:border-border-dark">
                            <button
                                type="button"
                                onClick={closeCheckout}
                                disabled={submitting}
                                className="rounded-md px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-60 dark:text-ink-dark-soft dark:hover:text-ink-dark"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={submitting}
                                className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 disabled:opacity-60 dark:bg-emerald-600"
                            >
                                {submitting ? "Placing…" : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
