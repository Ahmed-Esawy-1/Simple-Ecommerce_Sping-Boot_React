import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    ArrowLeft,
    ImageOff,
    Minus,
    Plus,
    Pencil,
    Trash2,
    ShoppingBag,
    TriangleAlert,
} from "lucide-react";
import {
    getProductById,
    getProductImageUrl,
    deleteProduct,
} from "../api/productApi";
import { formatCurrency, formatDisplayDate } from "../utils/format";
import { useCart } from "../context/CartContext";
import StatusTag from "../components/StatusTag";
import EmptyState from "../components/EmptyState";
import ConfirmDialog from "../components/ConfirmDialog";
import { Spinner } from "../components/Loader";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [quantity, setQuantity] = useState(1);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [added, setAdded] = useState(false);

    // ---- FETCH PRODUCT DATA -----------------------------------------------------------------------------
    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        getProductById(id)
            .then((data) => {
                if (cancelled) return;
                setProduct(data);
                setQuantity(1);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    // ---- DELETE PRODUCT ----------------------------------------------------------------------------------------
    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteProduct(id);
            navigate("/");
        } catch {
            setDeleting(false);
            setConfirmOpen(false);
        }
    };

    // ---- ADD TO CART ----------------------------------------------------------------
    const handleAddToCart = () => {
        addToCart(product, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    // ---- LOADING --------
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center py-24 text-ink-soft dark:text-ink-dark-soft">
                <Spinner size={22} />
            </div>
        );
    }

    // ---- ERROR ----------------
    if (status === "error" || !product) {
        return (
            <EmptyState
                icon={TriangleAlert}
                title="Product not found"
                description="This product may have been removed, or the catalog service is unreachable."
                action={
                    <Link
                        to="/"
                        className="mt-1 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                    >
                        Back to catalog
                    </Link>
                }
            />
        );
    }

    const hasImage = Boolean(product.imageName);
    const inStock = product.productAvailable && product.stockQuantity > 0;

    const specs = [
        ["Brand", product.brand || "—"],
        ["Category", product.category || "—"],
        ["Released", formatDisplayDate(product.releaseDate)],
        ["Stock", `${product.stockQuantity ?? 0} units`],
    ];

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="grid gap-8 lg:grid-cols-2">
                {/* PRODUCT IMAGE */}
                <div className="aspect-square overflow-hidden rounded-lg border border-border bg-black/5 dark:border-border-dark dark:bg-white/5">
                    {hasImage ? (
                        <img
                            src={getProductImageUrl(product.id)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-ink-soft/50 dark:text-ink-dark-soft/50">
                            <ImageOff size={40} strokeWidth={1.5} />
                        </div>
                    )}
                </div>
                {/* PRODUCT INFO */}
                <div className="flex flex-col">
                    <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                        {(product.category || "PRODUCT").toUpperCase()}
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                        {product.name}
                    </h1>
                    <p className="mt-1 text-sm text-ink-soft dark:text-ink-dark-soft">
                        {product.brand}
                    </p>

                    <div className="mt-4 flex items-center gap-4">
                        <span className="font-mono text-2xl font-semibold text-ink dark:text-ink-dark">
                            {formatCurrency(product.price)}
                        </span>
                        <StatusTag
                            available={product.productAvailable}
                            stockQuantity={product.stockQuantity}
                        />
                    </div>

                    {product.description && (
                        <p className="mt-4 text-sm leading-relaxed text-ink-soft dark:text-ink-dark-soft">
                            {product.description}
                        </p>
                    )}

                    {/* SPEC SHEET */}
                    <dl className="mt-6 divide-y divide-border rounded-lg border border-border font-mono text-sm dark:divide-border-dark dark:border-border-dark">
                        {specs.map(([label, value]) => (
                            <div
                                key={label}
                                className="flex items-center justify-between px-4 py-2.5"
                            >
                                <dt className="text-ink-soft dark:text-ink-dark-soft">
                                    {label}
                                </dt>
                                <dd className="text-ink dark:text-ink-dark">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <div className="flex items-center rounded-md border border-border dark:border-border-dark">
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) => Math.max(1, q - 1))
                                }
                                disabled={!inStock}
                                className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink disabled:opacity-40 dark:text-ink-dark-soft dark:hover:text-ink-dark"
                                aria-label="Decrease quantity"
                            >
                                <Minus size={15} />
                            </button>
                            <span className="w-8 text-center font-mono text-sm text-ink dark:text-ink-dark">
                                {quantity}
                            </span>
                            <button
                                type="button"
                                onClick={() =>
                                    setQuantity((q) =>
                                        Math.min(
                                            product.stockQuantity || 1,
                                            q + 1,
                                        ),
                                    )
                                }
                                disabled={!inStock}
                                className="flex h-10 w-10 items-center justify-center text-ink-soft transition-colors hover:text-ink disabled:opacity-40 dark:text-ink-dark-soft dark:hover:text-ink-dark"
                                aria-label="Increase quantity"
                            >
                                <Plus size={15} />
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={!inStock}
                            className="flex flex-1 items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-600 sm:flex-none"
                        >
                            <ShoppingBag size={16} />
                            {added
                                ? "Added"
                                : inStock
                                  ? "Add to cart"
                                  : "Out of stock"}
                        </button>
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-8 flex gap-2 border-t border-border pt-6 dark:border-border-dark">
                        <Link
                            to={`/products/${product.id}/edit`}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-emerald-700 hover:text-emerald-700 dark:border-border-dark dark:text-ink-dark dark:hover:border-emerald-400 dark:hover:text-emerald-300"
                        >
                            <Pencil size={15} />
                            Edit
                        </Link>
                        <button
                            type="button"
                            onClick={() => setConfirmOpen(true)}
                            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:border-red-600 hover:bg-red-600/5 dark:border-border-dark dark:text-red-400 dark:hover:border-red-400"
                        >
                            <Trash2 size={15} />
                            Delete
                        </button>
                    </div>
                </div>
            </div>

            {/* DELETE MODAL */}
            <ConfirmDialog
                open={confirmOpen}
                title={`Delete "${product.name}"?`}
                description="This removes the product from your catalog. This can't be undone."
                confirmLabel="Delete product"
                danger
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
