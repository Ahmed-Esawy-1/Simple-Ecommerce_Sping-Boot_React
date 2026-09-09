import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    Plus,
    ShoppingBag,
    Moon,
    Sun,
    Box,
    Search,
    ClipboardList,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { searchProducts, getProductImageUrl } from "../api/productApi";

const linkBase =
    "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors";
const linkActive = "text-emerald-700 dark:text-emerald-300";
const linkIdle =
    "text-ink-soft hover:text-ink dark:text-ink-dark-soft dark:hover:text-ink-dark";

// Change this if your product detail route is different (e.g. "/product").
const PRODUCT_DETAIL_PATH = "/products";

export default function Navbar() {
    const { totalItems } = useCart();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const searchBoxRef = useRef(null);
    const debounceRef = useRef(null);

    // ---- DEBOUNCED SEARCH-AS-YOU-TYPE -----------------------------------------
    useEffect(() => {
        const keyword = query.trim();

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (!keyword) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        debounceRef.current = setTimeout(async () => {
            try {
                const data = await searchProducts(keyword);
                setResults(Array.isArray(data) ? data : []);
            } catch {
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [query]);


    // ---- GO TO PRODUCT DETAIL --------------------------------------------------
    const goToProduct = (product) => {
        setMenuOpen(false);
        setQuery("");
        setResults([]);
        navigate(`${PRODUCT_DETAIL_PATH}/${product.id}`);
    };

    const showMenu = menuOpen && query.trim().length > 0;

    // ---- SEARCH BOX ---------------------------------------------------------------------------------------------
    const renderSearchBox = () => (
        <div ref={searchBoxRef} className="relative w-full">
            <div className="relative w-full">
                <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft dark:text-ink-dark-soft"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setMenuOpen(true);
                    }}
                    onFocus={() => setMenuOpen(true)}
                    placeholder="Search products…"
                    aria-label="Search products"
                    autoComplete="off"
                    className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-emerald-700 dark:border-border-dark dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-ink-dark-soft/50 dark:focus:border-emerald-400"
                />
            </div>

            {/* RESULTS DROPDOWN */}
            {showMenu && (
                <div
                    onMouseDown={(e) => e.stopPropagation()}
                    className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-96 overflow-auto rounded-md border border-border bg-paper shadow-lg dark:border-border-dark dark:bg-paper-dark"
                >
                    {loading ? (
                        <p className="px-4 py-3 text-sm text-ink-soft dark:text-ink-dark-soft">
                            Searching…
                        </p>
                    ) : results.length === 0 ? (
                        <p className="px-4 py-3 text-sm text-ink-soft dark:text-ink-dark-soft">
                            No products found.
                        </p>
                    ) : (
                        <ul>
                            {results.map((product) => (
                                <li key={product.id}>
                                    <button
                                        type="button"
                                        className="flex w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                        onMouseDown={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            goToProduct(product);
                                        }}
                                    >
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-black/5 dark:bg-white/5">
                                            {product.imageName ? (
                                                <img
                                                    src={getProductImageUrl(
                                                        product.id,
                                                    )}
                                                    alt=""
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <Box
                                                    size={16}
                                                    className="text-ink-soft dark:text-ink-dark-soft"
                                                />
                                            )}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-sm font-medium text-ink dark:text-ink-dark">
                                                {product.name}
                                            </span>
                                            {product.brand && (
                                                <span className="block truncate text-xs text-ink-soft dark:text-ink-dark-soft">
                                                    {product.brand}
                                                </span>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );

    return (
        <header className="sticky top-0 z-40 border-b border-border bg-paper/90 backdrop-blur dark:border-border-dark dark:bg-paper-dark/90">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                <NavLink
                    to="/"
                    className="flex shrink-0 items-center gap-2 font-display text-lg font-semibold tracking-tight text-ink dark:text-ink-dark"
                >
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-700 text-white dark:bg-emerald-500">
                        <Box size={16} strokeWidth={2.25} />
                    </span>
                    Shopfront
                </NavLink>

                {/* SEARCH — desktop */}
                <div className="hidden max-w-sm flex-1 sm:block">
                    {renderSearchBox()}
                </div>

                <nav className="flex items-center gap-1 sm:gap-2">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/products/new"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Add product</span>
                    </NavLink>
                    <NavLink
                        to="/orders"
                        className={({ isActive }) =>
                            `${linkBase} ${isActive ? linkActive : linkIdle}`
                        }
                    >
                        <ClipboardList size={16} />
                        <span className="hidden sm:inline">Orders</span>
                    </NavLink>
                    <NavLink
                        to="/cart"
                        className={({ isActive }) =>
                            `${linkBase} relative ${isActive ? linkActive : linkIdle}`
                        }
                    >
                        <ShoppingBag size={16} />
                        <span className="hidden sm:inline">Cart</span>
                        {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold-500 px-1 font-mono text-[10px] font-semibold text-emerald-950">
                                {totalItems}
                            </span>
                        )}
                    </NavLink>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        aria-label={
                            theme === "dark"
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                        className="ml-1 flex h-9 w-9 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-black/5 hover:text-ink dark:text-ink-dark-soft dark:hover:bg-white/10 dark:hover:text-ink-dark"
                    >
                        {theme === "dark" ? (
                            <Sun size={17} />
                        ) : (
                            <Moon size={17} />
                        )}
                    </button>
                </nav>
            </div>

            {/* SEARCH — mobile row */}
            <div className="border-t border-border px-4 py-2 dark:border-border-dark sm:hidden">
                {renderSearchBox()}
            </div>
        </header>
    );
}
