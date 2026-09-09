import { useNavigate } from "react-router-dom";
import { ImageOff, ShoppingBag } from "lucide-react";
import { getProductImageUrl } from "../api/productApi";
import { formatCurrency } from "../utils/format";
import { useCart } from "../context/CartContext";
import StatusTag from "./StatusTag";

export default function ProductCard({ product }) {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const hasImage = Boolean(product.imageName);
    const inStock = product.productAvailable && product.stockQuantity > 0;

    // 
    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(product, 1);
    };

    return (
        <article
            onClick={() => navigate(`/products/${product.id}`)}
            className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-surface transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5 dark:border-border-dark dark:bg-surface-dark dark:hover:shadow-black/30"
        >
            <div className="aspect-square w-full overflow-hidden bg-black/5 dark:bg-white/5">
                {hasImage ? (
                    <img
                        src={getProductImageUrl(product.id)}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-ink-soft/50 dark:text-ink-dark-soft/50">
                        <ImageOff size={28} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2 p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="truncate text-[11px] font-medium uppercase tracking-wider text-ink-soft dark:text-ink-dark-soft">
                            {product.brand || "Unbranded"}
                        </p>
                        <h3 className="truncate font-display text-base font-semibold text-ink dark:text-ink-dark">
                            {product.name}
                        </h3>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <span className="font-mono text-lg font-semibold text-ink dark:text-ink-dark">
                        {formatCurrency(product.price)}
                    </span>
                    <StatusTag
                        available={product.productAvailable}
                        stockQuantity={product.stockQuantity}
                    />
                </div>

                <button
                    type="button"
                    onClick={handleAdd}
                    disabled={!inStock}
                    className="mt-1 flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm font-medium text-ink transition-colors hover:border-emerald-700 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-border-dark dark:text-ink-dark dark:hover:border-emerald-400 dark:hover:text-emerald-300"
                >
                    <ShoppingBag size={15} />
                    Add to cart
                </button>
            </div>
        </article>
    );
}
