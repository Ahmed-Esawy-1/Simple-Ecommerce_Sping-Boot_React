import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "shopfront-cart";

function loadCart() {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(loadCart);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    // ADD
    const addToCart = (product, quantity = 1) => {
        setItems((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            const cap = product.stockQuantity ?? Infinity;
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id
                        ? {
                              ...i,
                              quantity: Math.min(i.quantity + quantity, cap),
                          }
                        : i,
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    brand: product.brand,
                    stockQuantity: product.stockQuantity,
                    quantity: Math.min(quantity, cap),
                    imageName: product.imageName,
                },
            ];
        });
    };

    // REMOVE
    const removeFromCart = (id) =>
        setItems((prev) => prev.filter((i) => i.id !== id));

    // QUANTITY
    const updateQuantity = (id, quantity) =>
        setItems((prev) =>
            prev
                .map((i) =>
                    i.id === id
                        ? {
                              ...i,
                              quantity: Math.max(
                                  1,
                                  Math.min(
                                      quantity,
                                      i.stockQuantity ?? Infinity,
                                  ),
                              ),
                          }
                        : i,
                )
                .filter((i) => i.quantity > 0),
        );

    // CLEAR ALL ITEMS
    const clearCart = () => setItems([]);

    // NUMBER OF ITEMS
    const totalItems = useMemo(
        () => items.reduce((sum, i) => sum + i.quantity, 0),
        [items],
    );
    // TOTAL PRICE
    const totalPrice = useMemo(
        () => items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0),
        [items],
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
}
