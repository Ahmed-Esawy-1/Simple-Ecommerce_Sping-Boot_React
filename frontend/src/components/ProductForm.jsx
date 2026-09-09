import { useEffect, useRef, useState } from "react";
import { ImagePlus, X, Sparkles, Loader2 } from "lucide-react";
import { inputDateToApiDate, apiDateToInputDate } from "../utils/format";
import {
    generateProductDescription,
    generateProductImage,
} from "../api/productApi";

const CATEGORIES = ["Phones", "Shoes", "Electronics", "Perfume"];

const emptyForm = {
    name: "",
    brand: "",
    category: "",
    price: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: true,
    description: "",
};

async function urlToFile(url, filename = "image.jpg") {
    const res = await fetch(url);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || "image/jpeg" });
}

export default function ProductForm({
    initialProduct,
    initialImageUrl,
    submitLabel,
    onSubmit,
    submitting,
}) {
    const [form, setForm] = useState(emptyForm);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageRemoved, setImageRemoved] = useState(false);
    const [errors, setErrors] = useState({});
    const [preparingSubmit, setPreparingSubmit] = useState(false);
    const fileInputRef = useRef(null);

    // ---- AI GENERATION STATE -------------------------------------------------------
    const [generatingDescription, setGeneratingDescription] = useState(false);
    const [generatingImage, setGeneratingImage] = useState(false);
    const [aiError, setAiError] = useState("");

    // ---- INIT ON EDIT --------------------------------------------------------------
    useEffect(() => {
        if (!initialProduct) return;
        setForm({
            name: initialProduct.name || "",
            brand: initialProduct.brand || "",
            category: initialProduct.category || "",
            price: initialProduct.price ?? "",
            stockQuantity: initialProduct.stockQuantity ?? "",
            releaseDate: apiDateToInputDate(initialProduct.releaseDate),
            productAvailable: initialProduct.productAvailable ?? true,
            description: initialProduct.description || "",
        });

        setImageFile(null);
        setImagePreview(null);
        setImageRemoved(false);
    }, [initialProduct]);

    const displayImage =
        imagePreview || (!imageRemoved ? initialImageUrl : null);

    // ---- HANDLE INPUTS CHANGE -----------------------------------------------------------------
    const update = (field) => (e) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [field]: value }));
    };

    // ---- HANDLE FILE CHANGE -----------------------------------------------------------------
    const handleFile = (file) => {
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setImageRemoved(false); // picking a new file cancels any pending removal
        setErrors((prev) => ({ ...prev, image: undefined }));
    };

    // ---- CLEAR IMAGE -----------------------------------------------------------------
    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setImageRemoved(true);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // ---- AI: GENERATE DESCRIPTION -----------------------------------------------------------------
    const canGenerate =
        form.name.trim().length > 0 &&
        form.brand.trim().length > 0 &&
        form.category != "";

    const handleGenerateDescription = async () => {
        if (!canGenerate || generatingDescription) return;
        setAiError("");
        setGeneratingDescription(true);
        try {
            const description = await generateProductDescription({
                name: form.name.trim(),
                category: form.category.trim(),
                brand: form.brand.trim(),
            });
            setForm((f) => ({ ...f, description }));
        } catch (err) {
            console.error(err);
            setAiError("Couldn't generate a description. Try again.");
        } finally {
            setGeneratingDescription(false);
        }
    };

    // ---- AI: GENERATE IMAGE -----------------------------------------------------------------
    const canGenerateImg = canGenerate && form.description != "";
    const handleGenerateImage = async () => {
        if (!canGenerateImg || generatingImage) return;
        setAiError("");
        setGeneratingImage(true);
        try {
            const file = await generateProductImage({
                name: form.name.trim(),
                brand: form.brand.trim(),
                category: form.category.trim(),
                description: form.description.trim(),
            });
            handleFile(file); // reuse the exact same path as a manual upload
        } catch (err) {
            console.log(err);
            setAiError("Couldn't generate an image. Try again.");
        } finally {
            setGeneratingImage(false);
        }
    };

    // ---- VALIDATION -----------------------------------------------------------------
    const isCreateMode = !initialProduct;

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = "Name is required.";
        if (form.price === "" || Number(form.price) < 0)
            next.price = "Enter a valid price.";
        if (form.stockQuantity === "" || Number(form.stockQuantity) < 0)
            next.stockQuantity = "Enter a valid quantity.";

        if (isCreateMode) {
            if (!imageFile) next.image = "Please upload a product image.";
        } else if (imageRemoved && !imageFile) {
            next.image = "Please upload a new image, or keep the current one.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    // --- SUBMIT ------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            name: form.name.trim(),
            brand: form.brand.trim(),
            category: form.category.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stockQuantity: Number(form.stockQuantity),
            productAvailable: form.productAvailable,
            releaseDate: inputDateToApiDate(form.releaseDate),
        };

        let fileToSend = imageFile;

        if (!fileToSend && !imageRemoved && initialImageUrl) {
            try {
                setPreparingSubmit(true);
                fileToSend = await urlToFile(
                    initialImageUrl,
                    "current-image.jpg",
                );
            } catch {
                setErrors((prev) => ({
                    ...prev,
                    image: "Couldn't load the current image. Please re-upload it.",
                }));
                setPreparingSubmit(false);
                return;
            } finally {
                setPreparingSubmit(false);
            }
        }

        onSubmit(payload, fileToSend);
    };

    const inputClass =
        "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-emerald-700 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-dark-soft/50 dark:focus:border-emerald-400";
    const labelClass =
        "mb-1.5 block text-sm font-medium text-ink dark:text-ink-dark";
    const errorClass = "mt-1 text-xs text-red-600 dark:text-red-400";

    const isBusy = submitting || preparingSubmit;

    return (
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-2">
            {/* IMAGE SECTION */}
            <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <span className={labelClass + " mb-0"}>
                        Product image
                        {isCreateMode && (
                            <span className="text-red-600 dark:text-red-400">
                                {" "}
                                *
                            </span>
                        )}
                    </span>
                    <button
                        type="button"
                        onClick={handleGenerateImage}
                        disabled={!canGenerateImg || generatingImage}
                        title={
                            !canGenerateImg
                                ? "Enter a product name first"
                                : "Generate an image with AI"
                        }
                        className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/30 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-700/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/30 dark:text-emerald-300"
                    >
                        {generatingImage ? (
                            <>
                                <Loader2 size={13} className="animate-spin" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <Sparkles size={13} />
                                Generate with AI
                            </>
                        )}
                    </button>
                </div>
                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleFile(e.dataTransfer.files?.[0]);
                    }}
                    className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-black/5 dark:border-border-dark dark:bg-white/5"
                >
                    {generatingImage ? (
                        <div className="flex flex-col items-center gap-2 text-ink-soft dark:text-ink-dark-soft">
                            <Loader2 size={28} className="animate-spin" />
                            <span className="text-sm">Generating image…</span>
                        </div>
                    ) : displayImage ? (
                        <>
                            <img
                                src={displayImage}
                                alt="Product preview"
                                className="h-full w-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={clearImage}
                                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
                                aria-label="Remove image"
                            >
                                <X size={15} />
                            </button>
                        </>
                    ) : (
                        <label className="flex cursor-pointer flex-col items-center gap-2 text-ink-soft dark:text-ink-dark-soft">
                            <ImagePlus size={28} strokeWidth={1.5} />
                            <span className="text-sm">
                                Click or drop an image here
                            </span>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                    handleFile(e.target.files?.[0])
                                }
                            />
                        </label>
                    )}
                </div>
                {displayImage && !generatingImage && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-300"
                    >
                        Replace image
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                        />
                    </button>
                )}
                {errors.image && <p className={errorClass}>{errors.image}</p>}
            </div>

            {/* INFO SECTION */}
            <div className="space-y-4">
                {aiError && (
                    <div className="rounded-md border border-red-600/30 bg-red-600/5 px-3 py-2 text-xs text-red-600 dark:border-red-400/30 dark:text-red-400">
                        {aiError}
                    </div>
                )}

                {/* Name */}
                <div>
                    <label className={labelClass} htmlFor="name">
                        Name
                    </label>
                    <input
                        id="name"
                        className={inputClass}
                        value={form.name}
                        onChange={update("name")}
                        placeholder="e.g. Nomad Ceramic Mug"
                    />
                    {errors.name && <p className={errorClass}>{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Brand */}
                    <div>
                        <label className={labelClass} htmlFor="brand">
                            Brand
                        </label>
                        <input
                            id="brand"
                            className={inputClass}
                            value={form.brand}
                            onChange={update("brand")}
                            placeholder="e.g. Nomad"
                        />
                    </div>
                    {/* Category */}
                    <div>
                        <label className={labelClass} htmlFor="category">
                            Category
                        </label>
                        <select
                            id="category"
                            className={inputClass}
                            value={form.category}
                            onChange={update("category")}
                        >
                            <option value="">Select a category</option>
                            {CATEGORIES.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label className={labelClass} htmlFor="price">
                            Price (USD)
                        </label>
                        <input
                            id="price"
                            type="number"
                            min="0"
                            step="0.01"
                            className={inputClass}
                            value={form.price}
                            onChange={update("price")}
                            placeholder="0.00"
                        />
                        {errors.price && (
                            <p className={errorClass}>{errors.price}</p>
                        )}
                    </div>
                    {/* Stock quantity */}
                    <div>
                        <label className={labelClass} htmlFor="stockQuantity">
                            Stock quantity
                        </label>
                        <input
                            id="stockQuantity"
                            type="number"
                            min="0"
                            className={inputClass}
                            value={form.stockQuantity}
                            onChange={update("stockQuantity")}
                            placeholder="0"
                        />
                        {errors.stockQuantity && (
                            <p className={errorClass}>{errors.stockQuantity}</p>
                        )}
                    </div>
                </div>

                {/* Release date */}
                <div>
                    <label className={labelClass} htmlFor="releaseDate">
                        Release date
                    </label>
                    <input
                        id="releaseDate"
                        type="date"
                        className={inputClass}
                        value={form.releaseDate}
                        onChange={update("releaseDate")}
                    />
                </div>

                {/* Description */}
                <div>
                    <div className="mb-1.5 flex items-center justify-between">
                        <label
                            className={labelClass + " mb-0"}
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <button
                            type="button"
                            onClick={handleGenerateDescription}
                            disabled={!canGenerate || generatingDescription}
                            title={
                                !canGenerate
                                    ? "Enter a product name first"
                                    : "Generate a description with AI"
                            }
                            className="inline-flex items-center gap-1.5 rounded-md border border-emerald-700/30 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-700/10 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/30 dark:text-emerald-300"
                        >
                            {generatingDescription ? (
                                <>
                                    <Loader2
                                        size={13}
                                        className="animate-spin"
                                    />
                                    Generating…
                                </>
                            ) : (
                                <>
                                    <Sparkles size={13} />
                                    Generate with AI
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        id="description"
                        rows={4}
                        className={inputClass}
                        value={form.description}
                        onChange={update("description")}
                        placeholder="What makes this product worth listing?"
                        disabled={generatingDescription}
                    />
                </div>

                <label className="flex items-center gap-2.5 text-sm font-medium text-ink dark:text-ink-dark">
                    <input
                        type="checkbox"
                        checked={form.productAvailable}
                        onChange={update("productAvailable")}
                        className="h-4 w-4 rounded border-border accent-emerald-700 dark:border-border-dark"
                    />
                    Available for purchase
                </label>

                <button
                    type="submit"
                    disabled={isBusy}
                    className="mt-2 w-full rounded-md bg-emerald-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700/90 disabled:opacity-60 dark:bg-emerald-600 sm:w-auto sm:px-8"
                >
                    {preparingSubmit
                        ? "Preparing…"
                        : submitting
                          ? "Saving…"
                          : submitLabel}
                </button>
            </div>
        </form>
    );
}
