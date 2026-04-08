import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { formatAddressOneLine, isCompleteAddrFields, listDeliverableAddresses } from "../utils/address.js";

const emptyForm = () => ({
  label: "Home",
  line1: "",
  line2: "",
  city: "",
  region: "",
  postalCode: "",
  country: ""
});

export function AddressesPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setError("");
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const addresses = user ? listDeliverableAddresses(user) : [];
  const atMax = addresses.length >= 3;

  const startEdit = (addr) => {
    setEditingId(addr.id);
    setForm({
      label: addr.label || "Home",
      line1: addr.line1 || "",
      line2: addr.line2 || "",
      city: addr.city || "",
      region: addr.region || "",
      postalCode: addr.postalCode || "",
      country: addr.country || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!isCompleteAddrFields(form)) {
      setError("Fill in street, city, postal code, and country.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      if (editingId === "new") {
        await api.post("/auth/addresses", form);
      } else {
        await api.patch(`/auth/addresses/${editingId}`, form);
      }
      cancelEdit();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save address.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Remove this saved address?")) return;
    setError("");
    try {
      await api.delete(`/auth/addresses/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove address.");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <p className="text-sm text-neutral-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Saved addresses</h1>
          <p className="mt-1 text-sm text-neutral-600">Up to 3 addresses for checkout. Choose one when you place an order.</p>
        </div>
        <Link to="/" className="text-sm font-medium text-blue-700 hover:underline">
          Back to shop
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-red-600">{error}</p>}

      <ul className="mt-8 space-y-3">
        {addresses.map((addr) => (
          <li
            key={addr.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div>
              <p className="text-sm font-semibold text-neutral-900">{addr.label || "Address"}</p>
              <p className="mt-1 text-sm text-neutral-600">{formatAddressOneLine(addr)}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(addr)}
                className="text-xs font-medium text-blue-700 hover:underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => remove(addr.id)}
                className="text-xs font-medium text-red-700 hover:underline"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {!atMax && editingId !== "new" && (
        <button
          type="button"
          onClick={() => {
            setEditingId("new");
            setForm(emptyForm());
          }}
          className="mt-6 text-sm font-semibold text-neutral-900 underline"
        >
          Add address ({addresses.length}/3)
        </button>
      )}

      {atMax && <p className="mt-6 text-sm text-neutral-500">Maximum of 3 addresses reached. Remove one to add another.</p>}

      {editingId && (
        <form onSubmit={submitEdit} className="mt-8 space-y-3 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <h2 className="text-sm font-semibold text-neutral-900">
            {editingId === "new" ? "New address" : "Edit address"}
          </h2>
          <div>
            <label className="text-xs font-medium text-neutral-700" htmlFor="addr-label">
              Label
            </label>
            <input
              id="addr-label"
              value={form.label}
              onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))}
              className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
              maxLength={40}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700" htmlFor="addr-line1">
              Address line 1
            </label>
            <input
              id="addr-line1"
              value={form.line1}
              onChange={(e) => setForm((f) => ({ ...f, line1: e.target.value }))}
              className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-700" htmlFor="addr-line2">
              Address line 2 (optional)
            </label>
            <input
              id="addr-line2"
              value={form.line2}
              onChange={(e) => setForm((f) => ({ ...f, line2: e.target.value }))}
              className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-neutral-700" htmlFor="addr-city">
                City
              </label>
              <input
                id="addr-city"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-700" htmlFor="addr-region">
                State / region
              </label>
              <input
                id="addr-region"
                value={form.region}
                onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-medium text-neutral-700" htmlFor="addr-postal">
                Postal code
              </label>
              <input
                id="addr-postal"
                value={form.postalCode}
                onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-700" htmlFor="addr-country">
                Country
              </label>
              <input
                id="addr-country"
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="mt-1 w-full border border-neutral-300 bg-white px-2 py-1.5 text-sm"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-neutral-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:bg-neutral-400"
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
