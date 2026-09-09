import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct } from "../api/productApi";

export default function AddProduct() {
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (payload, imageFile) => {
        setSubmitting(true);
        setError("");
        try {
            const created = await createProduct(payload, imageFile);
            alert("Created Successfully")
            navigate("/")
        } catch {
            setError(
                "Couldn't save the product. Check that the backend is running and try again.",
            );
            setSubmitting(false);
        }
    };

    return (
        <div>
            {/* HEADER */}
            <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                NEW LISTING
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                Add product
            </h1>
            <p className="mt-1 mb-8 text-sm text-ink-soft dark:text-ink-dark-soft">
                Fill in the details below to add a new item to the catalog.
            </p>

            {/* ERROR */}
            {error && (
                <div className="mb-6 rounded-md border border-red-600/30 bg-red-600/5 px-4 py-3 text-sm text-red-600 dark:border-red-400/30 dark:text-red-400">
                    {error}
                </div>
            )}
            {/* FORM */}
            <ProductForm
                submitLabel="Add product"
                submitting={submitting}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
