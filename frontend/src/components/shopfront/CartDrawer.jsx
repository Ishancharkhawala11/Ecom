import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { FREE_SHIPPING_MIN_USD } from "../../constants/shop.js";
import {
  formatAddressOneLine,
  hasAnySavedAddress,
  listDeliverableAddresses
} from "../../utils/address.js";

function IconClose(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  );
}

const defaultLoginRedirect = { pathname: "/login", search: "?next=%2F" };

const emptyAddress = () => ({
  label: "Home",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: ""
});

export function CartDrawer({
  open,
  onClose,
  cart,
  setCart,
  user,
  onRequireSignIn,
  loginRedirect = defaultLoginRedirect,
  onUserRefresh
}) {
  const [orderError, setOrderError] = useState("");
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressDraft, setAddressDraft] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);
  const [paypalConfig, setPaypalConfig] = useState(null);
  const [paypalLoadError, setPaypalLoadError] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cart]
  );

  const untilFree = Math.max(0, FREE_SHIPPING_MIN_USD - subtotal);
  const qualifiesFree = subtotal >= FREE_SHIPPING_MIN_USD;
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_MIN_USD) * 100);

  useEffect(() => {
    if (open) setOrderError("");
  }, [open]);

  useEffect(() => {
    if (!open) {
      setShowAddressForm(false);
      setAddressDraft(emptyAddress());
    }
  }, [open]);

  useEffect(() => {
    if (!user?.addresses?.length) {
      setSelectedAddressId(null);
      return;
    }
    const list = listDeliverableAddresses(user);
    if (!list.length) {
      setSelectedAddressId(null);
      return;
    }
    setSelectedAddressId((prev) =>
      prev && list.some((a) => a.id === prev) ? prev : list[0].id
    );
  }, [user]);

  useEffect(() => {
    if (!open || !user) return;
    let cancelled = false;
    setPaypalLoadError(null);
    setPaypalConfig(null);
    api
      .get("/paypal/config")
      .then(({ data }) => {
        if (!cancelled) {
          setPaypalConfig(data);
          setPaypalLoadError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          const net =
            err.code === "ERR_NETWORK" ||
            err.message === "Network Error" ||
            !err.response;
          setPaypalLoadError(
            net
              ? "Cannot reach the backend at http://localhost:5000 — start the API server (npm run dev in the backend folder)."
              : "Could not load PayPal settings from the server."
          );
          setPaypalConfig({ enabled: false, clientId: "", currency: "USD" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const setQty = (productId, next) => {
    const q = Math.max(0, next);
    if (q === 0) {
      setCart(cart.filter((item) => item.productId !== productId));
      return;
    }
    const line = cart.find((item) => item.productId === productId);
    const max = line?.stock != null ? Number(line.stock) : Infinity;
    const capped = Math.min(q, max);
    setCart(
      cart.map((item) =>
        item.productId === productId ? { ...item, quantity: capped } : item
      )
    );
  };

  const removeLine = (productId) => {
    setCart(cart.filter((item) => item.productId !== productId));
  };

  const submitOrderWithExplicit = async ({ addressId = null, shippingAddress = null } = {}) => {
    setOrderError("");
    setSubmitting(true);
    try {
      const body = {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity
        }))
      };
      const aid = addressId ?? selectedAddressId;
      if (shippingAddress) {
        body.shippingAddress = shippingAddress;
      } else if (aid) {
        body.addressId = aid;
      }
      await api.post("/orders", body);
      await onUserRefresh?.();
      setCart([]);
      setShowAddressForm(false);
      onClose();
    } catch (err) {
      setOrderError(err.response?.data?.message || "Could not complete purchase.");
    } finally {
      setSubmitting(false);
    }
  };

  const placeOrder = async () => {
    if (!cart.length) return;
    if (!user) {
      onRequireSignIn?.();
      return;
    }
    if (!hasAnySavedAddress(user)) {
      setAddressDraft(emptyAddress());
      setShowAddressForm(true);
      return;
    }
    await submitOrderWithExplicit({});
  };

  const saveAddressAndPurchase = async (e) => {
    e.preventDefault();
    const a = {
      label: addressDraft.label.trim() || "Home",
      line1: addressDraft.line1.trim(),
      line2: addressDraft.line2.trim(),
      city: addressDraft.city.trim(),
      region: addressDraft.region.trim(),
      postalCode: addressDraft.postalCode.trim(),
      country: addressDraft.country.trim()
    };
    if (!a.line1 || !a.city || !a.postalCode || !a.country) {
      setOrderError("Fill in street, city, postal code, and country.");
      return;
    }
    setOrderError("");
    setSubmitting(true);
    try {
      const { data } = await api.post("/auth/addresses", {
        label: a.label,
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        region: a.region,
        postalCode: a.postalCode,
        country: a.country
      });
      await onUserRefresh?.();
      const list = listDeliverableAddresses(data.user);
      const newId = list[list.length - 1]?.id;
      setSelectedAddressId(newId || null);
      setShowAddressForm(false);
      const { data: cfg } = await api.get("/paypal/config");
      if (!cfg.enabled) {
        await submitOrderWithExplicit({ addressId: newId });
      }
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.toLowerCase().includes("3")) {
        setOrderError("You already have 3 saved addresses. Remove one under Saved addresses.");
      } else {
        setOrderError(msg || "Could not save address.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-neutral-900";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-label="Order summary">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative flex h-full w-full max-w-md min-h-0 flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold uppercase tracking-wider text-neutral-900">Order summary</h2>
            <p className="mt-0.5 text-xs text-neutral-500">{cart.length} item{cart.length !== 1 ? "s" : ""} in your bag</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Close cart"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4" style={{ WebkitOverflowScrolling: "touch" }}>
          {!cart.length && (
            <p className="py-16 text-center text-sm text-neutral-500">Your bag is empty.</p>
          )}
          <ul className="space-y-4">
            {cart.map((item) => {
              const lineTotal = Number(item.price || 0) * item.quantity;
              const max = item.stock != null ? Number(item.stock) : null;
              return (
                <li
                  key={item.productId}
                  className="flex gap-3 border-b border-neutral-100 pb-4 last:border-0"
                >
                  <div className="h-20 w-16 shrink-0 bg-neutral-100" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-snug text-neutral-900">{item.name}</p>
                    <p className="mt-0.5 text-xs text-neutral-500">${Number(item.price).toFixed(2)} each</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center border border-neutral-300">
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50"
                          onClick={() => setQty(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="min-w-[2rem] text-center text-sm tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          className="px-2 py-1 text-sm text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
                          disabled={max != null && item.quantity >= max}
                          onClick={() => setQty(item.productId, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(item.productId)}
                        className="text-xs text-neutral-500 underline hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <p className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900">${lineTotal.toFixed(2)}</p>
                </li>
              );
            })}
          </ul>
        </div>

        <div
          className="max-h-[55vh] overflow-y-auto overscroll-contain border-t border-neutral-200 bg-neutral-50 px-5 py-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="mb-3">
            <div className="mb-1 flex justify-between text-xs text-neutral-600">
              <span>Shipping</span>
              <span>{qualifiesFree ? "Free" : "Calculated at checkout"}</span>
            </div>
            {!qualifiesFree && cart.length > 0 && (
              <>
                <div className="h-1.5 overflow-hidden bg-neutral-200">
                  <div
                    className="h-full bg-neutral-900 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-neutral-600">
                  Add <strong className="text-neutral-900">${untilFree.toFixed(2)}</strong> more for{" "}
                  <strong>free shipping</strong> (orders over ${FREE_SHIPPING_MIN_USD}).
                </p>
              </>
            )}
            {qualifiesFree && cart.length > 0 && (
              <p className="text-xs font-medium text-emerald-800">You qualify for free shipping.</p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-neutral-200 pt-3 text-sm">
            <span className="font-medium text-neutral-700">Subtotal</span>
            <span className="text-lg font-bold tabular-nums text-neutral-900">${subtotal.toFixed(2)}</span>
          </div>
          <p className="mt-1 text-[11px] text-neutral-500">Taxes included where applicable. Final total at checkout.</p>
          {!user && cart.length > 0 && (
            <p className="mt-3 text-xs text-neutral-600">
              <Link to={loginRedirect} className="font-semibold text-blue-700 hover:underline" onClick={onClose}>
                Sign in
              </Link>{" "}
              to complete your purchase.
            </p>
          )}
          {orderError && <p className="mt-2 text-sm text-red-600">{orderError}</p>}

          {user && !showAddressForm && cart.length > 0 && hasAnySavedAddress(user) && (
            <div className="mt-4 border-t border-neutral-200 pt-4">
              <p className="text-xs font-semibold text-neutral-900">Ship to</p>
              <ul className="mt-2 space-y-2">
                {listDeliverableAddresses(user).map((addr) => (
                  <li key={addr.id}>
                    <label className="flex cursor-pointer gap-2 rounded border border-transparent px-1 py-1 text-sm hover:bg-white">
                      <input
                        type="radio"
                        name="cart-ship-addr"
                        className="mt-1"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <span>
                        <span className="font-medium text-neutral-900">{addr.label || "Address"}</span>
                        <span className="mt-0.5 block text-xs text-neutral-600">
                          {formatAddressOneLine(addr)}
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {listDeliverableAddresses(user).length < 3 && (
                <button
                  type="button"
                  className="mt-2 text-xs font-medium text-blue-700 hover:underline"
                  onClick={() => {
                    setAddressDraft(emptyAddress());
                    setShowAddressForm(true);
                  }}
                >
                  Add another address ({listDeliverableAddresses(user).length}/3)
                </button>
              )}
              <Link
                to="/addresses"
                className="mt-2 block text-xs text-neutral-600 underline hover:text-neutral-900"
                onClick={onClose}
              >
                Manage saved addresses
              </Link>
            </div>
          )}

          {user && showAddressForm && (
            <form onSubmit={saveAddressAndPurchase} className="mt-4 space-y-3 border-t border-neutral-200 pt-4">
              <p className="text-sm font-semibold text-neutral-900">Save a shipping address</p>
              <p className="text-xs text-neutral-600">
                Saved to your account (max 3). You can pick it for each order.
              </p>
              <div>
                <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-label">
                  Label
                </label>
                <input
                  id="cart-addr-label"
                  value={addressDraft.label}
                  onChange={(e) => setAddressDraft((d) => ({ ...d, label: e.target.value }))}
                  className={inputCls}
                  maxLength={40}
                  placeholder="Home, Work…"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-line1">
                  Address line 1
                </label>
                <input
                  id="cart-addr-line1"
                  value={addressDraft.line1}
                  onChange={(e) => setAddressDraft((d) => ({ ...d, line1: e.target.value }))}
                  className={inputCls}
                  autoComplete="street-address"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-line2">
                  Address line 2 (optional)
                </label>
                <input
                  id="cart-addr-line2"
                  value={addressDraft.line2}
                  onChange={(e) => setAddressDraft((d) => ({ ...d, line2: e.target.value }))}
                  className={inputCls}
                  autoComplete="address-line2"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-city">
                    City
                  </label>
                  <input
                    id="cart-addr-city"
                    value={addressDraft.city}
                    onChange={(e) => setAddressDraft((d) => ({ ...d, city: e.target.value }))}
                    className={inputCls}
                    autoComplete="address-level2"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-region">
                    State / region
                  </label>
                  <input
                    id="cart-addr-region"
                    value={addressDraft.region}
                    onChange={(e) => setAddressDraft((d) => ({ ...d, region: e.target.value }))}
                    className={inputCls}
                    autoComplete="address-level1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-postal">
                    Postal code
                  </label>
                  <input
                    id="cart-addr-postal"
                    value={addressDraft.postalCode}
                    onChange={(e) => setAddressDraft((d) => ({ ...d, postalCode: e.target.value }))}
                    className={inputCls}
                    autoComplete="postal-code"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-700" htmlFor="cart-addr-country">
                    Country
                  </label>
                  <input
                    id="cart-addr-country"
                    value={addressDraft.country}
                    onChange={(e) => setAddressDraft((d) => ({ ...d, country: e.target.value }))}
                    className={inputCls}
                    autoComplete="country-name"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setOrderError("");
                  }}
                  className="flex-1 border border-neutral-300 py-2.5 text-sm font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-neutral-900 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:bg-neutral-400"
                >
                  {submitting
                    ? "Saving…"
                    : paypalConfig?.enabled
                      ? "Save address & continue"
                      : "Save & place order"}
                </button>
              </div>
            </form>
          )}

          {!showAddressForm && user && paypalConfig === null && cart.length > 0 && (
            <p className="mt-4 text-center text-xs text-neutral-500">Loading payment options…</p>
          )}

          {!showAddressForm &&
            user &&
            paypalConfig?.enabled &&
            !hasAnySavedAddress(user) &&
            cart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setAddressDraft(emptyAddress());
                  setShowAddressForm(true);
                }}
                className="mt-4 w-full bg-neutral-900 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800"
              >
                Add delivery address to pay
              </button>
            )}

          {!showAddressForm &&
            user &&
            paypalConfig?.enabled &&
            hasAnySavedAddress(user) &&
            selectedAddressId &&
            cart.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-medium text-neutral-700">Pay with PayPal</p>
              <p className="mb-3 text-[11px] text-neutral-500">
                Sandbox: log in with your PayPal personal test account at checkout.
              </p>
              <PayPalScriptProvider
                key={`${paypalConfig.clientId}:${paypalConfig.currency}`}
                options={{
                  clientId: paypalConfig.clientId,
                  currency: paypalConfig.currency,
                  intent: "capture"
                }}
              >
                <PayPalButtons
                  disabled={submitting}
                  style={{ layout: "vertical", label: "paypal" }}
                  forceReRender={[
                    cart.map((i) => `${i.productId}:${i.quantity}`).join("|"),
                    subtotal,
                    selectedAddressId
                  ]}
                  createOrder={async () => {
                    try {
                      const { data } = await api.post("/paypal/create-order", {
                        items: cart.map((item) => ({
                          productId: item.productId,
                          quantity: item.quantity
                        })),
                        addressId: selectedAddressId
                      });
                      return data.id;
                    } catch (err) {
                      const msg = err.response?.data?.message || err.message || "Could not create PayPal order.";
                      console.error("[paypal/createOrder] frontend failed", err);
                      setOrderError(msg);
                      throw err;
                    }
                  }}
                  onApprove={async (data) => {
                    setOrderError("");
                    setSubmitting(true);
                    try {
                      await api.post("/paypal/capture-order", {
                        orderID: data.orderID,
                        items: cart.map((item) => ({
                          productId: item.productId,
                          quantity: item.quantity
                        })),
                        addressId: selectedAddressId
                      });
                      await onUserRefresh?.();
                      setCart([]);
                      onClose();
                    } catch (err) {
                      setOrderError(err.response?.data?.message || "Payment could not be completed.");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  onError={(err) => {
                    console.error("[paypal/buttons] onError", err);
                    const msg =
                      err?.message ||
                      "PayPal popup failed to open. Disable browser shields/pop-up blocking or try Chrome Incognito.";
                    setOrderError(msg);
                  }}
                />
              </PayPalScriptProvider>
            </div>
          )}

          {!showAddressForm && user && paypalConfig && !paypalConfig.enabled && cart.length > 0 && (
            <>
              {paypalLoadError ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                  <p className="font-semibold">PayPal did not load</p>
                  <p className="mt-1 leading-relaxed">{paypalLoadError}</p>
                </div>
              ) : (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
                  <p className="font-semibold">PayPal button is hidden until the server is configured</p>
                  <p className="mt-1 leading-relaxed">
                    In <span className="font-mono">backend/.env</span> add your{" "}
                    <strong>Sandbox</strong> app credentials from{" "}
                    <a
                      href="https://developer.paypal.com/dashboard/applications/sandbox"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-amber-900 underline"
                    >
                      developer.paypal.com
                    </a>
                    :
                  </p>
                  <ul className="mt-2 list-inside list-disc space-y-0.5 font-mono text-[11px] text-amber-900">
                    <li>PAYPAL_CLIENT_ID=your_sandbox_client_id</li>
                    <li>PAYPAL_CLIENT_SECRET=your_sandbox_secret</li>
                    <li>PAYPAL_MODE=sandbox</li>
                  </ul>
                  <p className="mt-2 text-[11px] text-amber-900">
                    Restart the backend, refresh this page, open the bag again — the yellow PayPal button appears
                    under “Pay with PayPal”.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={placeOrder}
                disabled={
                  submitting ||
                  (hasAnySavedAddress(user) && !selectedAddressId)
                }
                className="mt-4 w-full bg-neutral-900 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
              >
                Complete purchase
              </button>
              {!paypalLoadError && (
                <p className="mt-2 text-center text-[11px] text-neutral-500">
                  Or use Complete purchase for a non-PayPal test order (no card).
                </p>
              )}
            </>
          )}

          {!showAddressForm && !user && cart.length > 0 && (
            <button
              type="button"
              onClick={placeOrder}
              disabled={!cart.length}
              className="mt-4 w-full bg-neutral-900 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              Sign in to complete purchase
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-2 w-full py-2 text-center text-xs text-neutral-600 underline hover:text-neutral-900"
          >
            Continue shopping
          </button>
        </div>
      </div>
    </div>
  );
}
