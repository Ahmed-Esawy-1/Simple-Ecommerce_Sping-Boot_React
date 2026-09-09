import { useEffect, useState } from "react";
import { TriangleAlert, X } from "lucide-react";
import { getOrders } from "../api/orderApi";
import { Spinner } from "../components/Loader";
import EmptyState from "../components/EmptyState";

const statusStyles = {
    PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    PROCESSING: "bg-sky-500/10 text-sky-700 dark:text-sky-300",
    SHIPPED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    DELIVERED: "bg-emerald-700/10 text-emerald-800 dark:text-emerald-300",
    CANCELLED: "bg-red-500/10 text-red-700 dark:text-red-400",
};

function StatusBadge({ status }) {
    const cls =
        statusStyles[status] ||
        "bg-black/5 text-ink-soft dark:bg-white/10 dark:text-ink-dark-soft";
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}
        >
            {status}
        </span>
    );
}

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("loading");
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        let cancelled = false;
        getOrders()
            .then((data) => {
                if (cancelled) return;
                setOrders(Array.isArray(data) ? data : []);
                setStatus("ready");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    // ---- LOADING ------------------------------------------------------------------------------------------
    if (status === "loading") {
        return (
            <div className="flex items-center justify-center py-24 text-ink-soft dark:text-ink-dark-soft">
                <Spinner size={22} />
            </div>
        );
    }

    // ---- ERROR ------------------------------------------------------------------------------------------
    if (status === "error") {
        return (
            <EmptyState
                icon={TriangleAlert}
                title="Couldn't load orders"
                description="The order service may be unreachable. Try refreshing the page."
            />
        );
    }

    // ---- EMPTY ------------------------------------------------------------------------------------------
    if (orders.length === 0) {
        return (
            <EmptyState
                icon={TriangleAlert}
                title="No orders yet"
                description="Orders will show up here once customers start checking out."
            />
        );
    }

    return (
        <div>
            {/* HEADER */}
            <p className="font-mono text-xs font-medium tracking-widest text-emerald-700 dark:text-emerald-300">
                ORDERS
            </p>
            <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl dark:text-ink-dark">
                All orders
            </h1>
            <p className="mt-1 mb-8 text-sm text-ink-soft dark:text-ink-dark-soft">
                {orders.length} order{orders.length === 1 ? "" : "s"} total.
            </p>

            {/* TABLE */}
            <div className="overflow-x-auto rounded-lg border border-border dark:border-border-dark">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-border bg-black/[0.02] text-left dark:border-border-dark dark:bg-white/[0.03]">
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                Order ID
                            </th>
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                Customer
                            </th>
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                Email
                            </th>
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                Date
                            </th>
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                Status
                            </th>
                            <th className="px-4 py-3 font-medium text-ink-soft dark:text-ink-dark-soft">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.orderId}
                                className="border-b border-border last:border-0 dark:border-border-dark"
                            >
                                <td className="px-4 py-3 font-mono text-xs text-ink dark:text-ink-dark">
                                    {order.orderId}
                                </td>
                                <td className="px-4 py-3 text-ink dark:text-ink-dark">
                                    {order.customerName}
                                </td>
                                <td className="px-4 py-3 text-ink-soft dark:text-ink-dark-soft">
                                    {order.email}
                                </td>
                                <td className="px-4 py-3 text-ink-soft dark:text-ink-dark-soft">
                                    {order.orderDate}
                                </td>
                                <td className="px-4 py-3">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedOrder(order)}
                                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-black/5 dark:border-border-dark dark:text-ink-dark dark:hover:bg-white/10"
                                    >
                                        Show
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ITEMS MODAL */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget)
                            setSelectedOrder(null);
                    }}
                >
                    <div className="w-full max-w-lg rounded-lg border border-border bg-paper shadow-xl dark:border-border-dark dark:bg-paper-dark">
                        <div className="flex items-center justify-between border-b border-border px-5 py-4 dark:border-border-dark">
                            <div>
                                <p className="font-mono text-xs text-ink-soft dark:text-ink-dark-soft">
                                    {selectedOrder.orderId}
                                </p>
                                <h2 className="font-display text-lg font-semibold text-ink dark:text-ink-dark">
                                    {selectedOrder.customerName}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedOrder(null)}
                                aria-label="Close"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-black/5 hover:text-ink dark:text-ink-dark-soft dark:hover:bg-white/10 dark:hover:text-ink-dark"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="max-h-96 overflow-auto px-5 py-4">
                            {selectedOrder.items?.length ? (
                                <table className="w-full border-collapse text-sm">
                                    <thead>
                                        <tr className="border-b border-border text-left dark:border-border-dark">
                                            <th className="pb-2 font-medium text-ink-soft dark:text-ink-dark-soft">
                                                Product
                                            </th>
                                            <th className="pb-2 font-medium text-ink-soft dark:text-ink-dark-soft">
                                                Qty
                                            </th>
                                            <th className="pb-2 text-right font-medium text-ink-soft dark:text-ink-dark-soft">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-border last:border-0 dark:border-border-dark"
                                            >
                                                <td className="py-2 text-ink dark:text-ink-dark">
                                                    {item.productName}
                                                </td>
                                                <td className="py-2 text-ink-soft dark:text-ink-dark-soft">
                                                    {item.quantity}
                                                </td>
                                                <td className="py-2 text-right text-ink dark:text-ink-dark">
                                                    ${item.totalPrice}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-sm text-ink-soft dark:text-ink-dark-soft">
                                    No items on this order.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
