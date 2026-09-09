import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageSearch, Plus, TriangleAlert } from "lucide-react";
import { getAllProducts } from "../api/productApi";
import ProductCard from "../components/ProductCard";
import { CardSkeletonGrid } from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | ready | error

    useEffect(() => {
        let cancelled = false;
        setStatus("loading");
        getAllProducts()
            .then((data) => {
                if (cancelled) return;
                setProducts(Array.isArray(data) ? data : []);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div>
            {/* HEADER */}
            <div className="mb-8 flex items-end justify-between gap-4">
                <div>
                    <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                        CATALOG
                    </p>
                    <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                        All products
                    </h1>
                </div>
                {status === "ready" && (
                    <span className="hidden font-mono text-sm text-ink-soft sm:block dark:text-ink-dark-soft">
                        {products.length}{" "}
                        {products.length === 1 ? "item" : "items"}
                    </span>
                )}
            </div>

            {/* LOADING */}
            {status === "loading" && <CardSkeletonGrid />}

            {/* ERROR */}
            {status === "error" && (
                <EmptyState
                    icon={TriangleAlert}
                    title="Can't reach the catalog service"
                    description="The product API didn't respond. Check that your backend is running and reachable at the configured API URL, then try again."
                    action={
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-1 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                        >
                            Retry
                        </button>
                    }
                />
            )}

            {/* READY & NO PRODUCTS */}
            {status === "ready" && products.length === 0 && (
                <EmptyState
                    icon={PackageSearch}
                    title="No products yet"
                    description="Add your first product to start building the catalog."
                    action={
                        <Link
                            to="/products/new"
                            className="mt-1 inline-flex items-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 dark:bg-emerald-600"
                        >
                            <Plus size={16} />
                            Add product
                        </Link>
                    }
                />
            )}

            {/* READY & EXIST PRODUCTS */}
            {status === "ready" && products.length > 0 && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
