import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { TriangleAlert } from "lucide-react";
import ProductForm from "../components/ProductForm";
import {
    getProductById,
    getProductImageUrl,
    updateProduct,
} from "../api/productApi";
import { Spinner } from "../components/Loader";
import EmptyState from "../components/EmptyState";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [status, setStatus] = useState("loading");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;
        getProductById(id)
            .then((data) => {
                if (cancelled) return;
                setProduct(data);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    // ---- SUBMIT --------------------------------------------------------------------------------
    const handleSubmit = async (payload, imageFile) => {
        setSubmitting(true);
        setError("");
        try {
            await updateProduct(id, payload, imageFile);
            alert("Updated Successfully.");
            navigate("/");
        } catch {
            setError(
                "Couldn't save changes. Check that the backend is running and try again.",
            );
            setSubmitting(false);
        }
    };

    // ---- LOADING ------------------------------------------------------------------------------------------
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center py-24 text-ink-soft dark:text-ink-dark-soft">
                <Spinner size={22} />
            </div>
        );
    }
    // ---- ERROR ------------------------------------------------------------------------------------------
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

    return (
        <div>
            {/* HEADER */}
            <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                EDITING
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                {product.name}
            </h1>
            <p className="mt-1 mb-8 text-sm text-ink-soft dark:text-ink-dark-soft">
                Update the details below, then save your changes.
            </p>

            {/* ERROR */}
            {error && (
                <div className="mb-6 rounded-md border border-red-600/30 bg-red-600/5 px-4 py-3 text-sm text-red-600 dark:border-red-400/30 dark:text-red-400">
                    {error}
                </div>
            )}
            {/* FORM */}
            <ProductForm
                initialProduct={product}
                initialImageUrl={
                    product.imageName ? getProductImageUrl(product.id) : null
                }
                submitLabel="Save changes"
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
