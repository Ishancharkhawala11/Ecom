import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const ACTIVE_STATUSES = ["placed", "processing", "shipped"];

function formatAddress(addr) {
  if (!addr) return "—";
  const parts = [
    addr.line1,
    addr.line2,
    [addr.city, addr.region].filter(Boolean).join(", "),
    [addr.postalCode, addr.country].filter(Boolean).join(" ")
  ].filter((p) => p && String(p).trim());
  return parts.length ? parts.join("\n") : "—";
}

function statusLabel(status) {
  const map = {
    placed: "Order placed",
    processing: "Processing",
    shipped: "Shipped — on the way",
    delivered: "Delivered",
    cancelled: "Cancelled"
  };
  return map[status] || status;
}

function OrderCard({ order }) {
  return (
    <li className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-100 pb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Order</p>
          <p className="font-mono text-sm text-neutral-900">{order._id}</p>
          <p className="mt-1 text-xs text-neutral-500">Placed {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-950">
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Ship to</p>
          <pre className="mt-1 whitespace-pre-wrap font-sans text-sm text-neutral-800">
            {formatAddress(order.shippingAddress)}
          </pre>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Total</p>
          <p className="mt-1 text-lg font-bold tabular-nums text-neutral-900">
            ${Number(order.totalAmount || 0).toFixed(2)}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4">
        {(order.items || []).map((line, idx) => {
          const p = line.product;
          const name = typeof p === "object" && p?.name ? p.name : "Product";
          return (
            <li key={idx} className="flex justify-between text-sm text-neutral-700">
              <span>
                {name} × {line.quantity}
              </span>
              <span className="tabular-nums">${(Number(line.price) * line.quantity).toFixed(2)}</span>
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export function PendingOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get("/orders/my-orders");
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeOrders = useMemo(
    () => orders.filter((o) => ACTIVE_STATUSES.includes(o.status)),
    [orders]
  );

  const pastOrders = useMemo(
    () => orders.filter((o) => !ACTIVE_STATUSES.includes(o.status)),
    [orders]
  );

  const deleteAllOrders = async () => {
    if (!orders.length) return;
    if (
      !window.confirm(
        "Delete every order in your history? This cannot be undone. Stock is not restored automatically."
      )
    ) {
      return;
    }
    setDeleting(true);
    setError("");
    try {
      await api.delete("/orders/my-orders");
      setOrders([]);
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete orders.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Your orders</h1>
          <p className="mt-1 text-sm text-neutral-600">
            In-progress orders and past orders. You will get a notification when a status changes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={deleteAllOrders}
              disabled={deleting}
              className="text-sm font-medium text-red-700 hover:underline disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete all my orders"}
            </button>
          )}
          <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">
            Continue shopping
          </Link>
        </div>
      </div>

      {loading && <p className="mt-10 text-sm text-neutral-500">Loading your orders…</p>}
      {error && <p className="mt-10 text-sm text-red-600">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <div className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-10 text-center">
          <p className="text-sm text-neutral-600">You have no orders yet.</p>
          <Link to="/" className="mt-4 inline-block text-sm font-semibold text-neutral-900 underline">
            Browse the shop
          </Link>
        </div>
      )}

      {!loading && !error && activeOrders.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-neutral-900">In progress</h2>
          <ul className="mt-4 flex flex-col gap-6">
            {activeOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </ul>
        </>
      )}

      {!loading && !error && pastOrders.length > 0 && (
        <>
          <h2 className="mt-10 text-lg font-semibold text-neutral-900">Past orders</h2>
          <ul className="mt-4 flex flex-col gap-6">
            {pastOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
