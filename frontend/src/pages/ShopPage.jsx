import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { CATEGORY_LABELS } from "../constants/shop.js";
import productImg1 from "../assets/product-1.jpg";
import productImg2 from "../assets/product-2.jpg";
import productImg3 from "../assets/product-3.jpg";
import productImg4 from "../assets/product-4.jpg";
import productImg5 from "../assets/product-5.jpg";
import productImg6 from "../assets/product-6.jpg";

const FALLBACK_PRODUCT_IMAGES = [productImg1, productImg2, productImg3, productImg4, productImg5, productImg6];

function productImageFor(product, index) {
  if (product.imageUrl && /^(https?:\/\/|data:image\/|blob:)/i.test(product.imageUrl)) {
    return product.imageUrl;
  }
  return FALLBACK_PRODUCT_IMAGES[index % FALLBACK_PRODUCT_IMAGES.length];
}

function discountPercent(product) {
  const cmp = product.compareAtPrice;
  const price = Number(product.price);
  if (cmp == null || cmp <= price) return 0;
  return Math.round((1 - price / cmp) * 1000) / 10;
}

/** Tiered installments similar to fashion PLPs (2–6×). */
function installmentPlan(price) {
  const p = Number(price);
  if (p < 50) return null;
  let n = 2;
  if (p >= 1200) n = 6;
  else if (p >= 500) n = 4;
  else if (p >= 150) n = 3;
  const each = Math.ceil((p / n) * 100) / 100;
  return { n, each };
}

const SORT_OPTIONS = [
  { value: "bestsellers", label: "Best sellers" },
  { value: "newest", label: "Release date" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "name-asc", label: "Name A – Z" },
  { value: "name-desc", label: "Name Z – A" }
];

const PAGE_SIZES = [12, 24, 36, 48];

const FILTER_KEYS = ["clothing", "home", "accessories", "general"];

function IconHeart({ filled }) {
  const path =
    "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z";
  if (filled) {
    return <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d={path} /></svg>;
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d={path} />
    </svg>
  );
}

export function ShopPage({ cart, setCart, searchQuery, onOpenCart, categoryFilter, setCategoryFilter }) {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [pageSize, setPageSize] = useState(24);
  const [filterOpen, setFilterOpen] = useState(false);
  const [wishlist, setWishlist] = useState(() => new Set());

  const loadProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
    const timer = setInterval(loadProducts, 15000);
    const onVisible = () => {
      if (document.visibilityState === "visible") loadProducts();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", loadProducts);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", loadProducts);
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { clothing: 0, home: 0, accessories: 0, general: 0 };
    for (const p of products) {
      const k = (p.category || "general").toLowerCase();
      if (counts[k] !== undefined) counts[k] += 1;
      else counts.general += 1;
    }
    return counts;
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = [...products];
    if (categoryFilter) {
      list = list.filter(
        (p) => (p.category || "general").toLowerCase() === categoryFilter.toLowerCase()
      );
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        const badge = (p.badge || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || badge.includes(q);
      });
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case "bestsellers":
          return Number(b.stock || 0) - Number(a.stock || 0);
        case "price-asc":
          return Number(a.price) - Number(b.price);
        case "price-desc":
          return Number(b.price) - Number(a.price);
        case "name-asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "newest":
        default: {
          const ta = new Date(a.createdAt || 0).getTime();
          const tb = new Date(b.createdAt || 0).getTime();
          return tb - ta;
        }
      }
    });
    return list;
  }, [products, categoryFilter, searchQuery, sortBy]);

  const pagedProducts = useMemo(
    () => visibleProducts.slice(0, pageSize),
    [visibleProducts, pageSize]
  );

  const toggleWishlist = (id) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const addToCart = (product) => {
    const existing = cart.find((item) => item.productId === product._id);
    if (existing) {
      const nextQty = existing.quantity + 1;
      const cap = product.stock != null ? Math.min(nextQty, product.stock) : nextQty;
      setCart(
        cart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: cap, stock: product.stock, price: product.price }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product._id,
          name: product.name,
          quantity: 1,
          price: product.price,
          stock: product.stock
        }
      ]);
    }
    onOpenCart?.();
  };

  const filterBody = (
    <>
      <p className="mt-0 text-xs font-semibold text-neutral-500 lg:mt-4">Department</p>
      <ul className="mt-2 space-y-1 border-b border-neutral-200 pb-4">
        <li>
          <button
            type="button"
            onClick={() => {
              setCategoryFilter(null);
              setFilterOpen(false);
            }}
            className={`flex w-full justify-between py-1.5 text-left text-sm ${
              !categoryFilter ? "font-semibold text-neutral-950" : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <span>All products</span>
            <span className="tabular-nums text-neutral-400">({products.length})</span>
          </button>
        </li>
        {FILTER_KEYS.map((key) => (
          <li key={key}>
            <button
              type="button"
              onClick={() => {
                setCategoryFilter(key);
                setFilterOpen(false);
              }}
              className={`flex w-full justify-between py-1.5 text-left text-sm ${
                categoryFilter === key ? "font-semibold text-neutral-950" : "text-neutral-600 hover:text-neutral-900"
              }`}
            >
              <span>{CATEGORY_LABELS[key] || key}</span>
              <span className="tabular-nums text-neutral-400">({categoryCounts[key] ?? 0})</span>
            </button>
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <div className="bg-neutral-100">
      <div className="border-b border-neutral-200 bg-white">
        <div className="mx-auto max-w-[1400px] px-4 py-6 lg:px-8">
          <nav className="text-xs text-neutral-500">
            <Link to="/" className="hover:text-neutral-900 hover:underline">
              Home
            </Link>
            <span className="mx-1.5 text-neutral-300">/</span>
            <span className="text-neutral-800">New in</span>
          </nav>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">New in</p>
          <h1 className="mt-1 font-serif text-3xl font-normal text-neutral-900 md:text-4xl">New arrivals</h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            Men&apos;s collection-style listing — filters, sort, and bag. Inspired by premium fashion retail PLPs.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-4 py-6 lg:px-8">
        <aside className="hidden w-56 shrink-0 lg:block">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900">Filter by</h2>
          {filterBody}
        </aside>

        {filterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close filters"
              onClick={() => setFilterOpen(false)}
            />
            <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold">Filter by</span>
                <button type="button" className="text-sm text-neutral-600 underline" onClick={() => setFilterOpen(false)}>
                  Close
                </button>
              </div>
              <div className="overflow-y-auto">{filterBody}</div>
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 border-b border-neutral-200 bg-white px-4 py-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="rounded-sm border border-neutral-400 bg-white px-3 py-1.5 text-sm font-medium text-neutral-900 lg:hidden"
              >
                Filter
              </button>
              <p className="text-sm text-neutral-600">
                <span className="font-semibold text-neutral-900">{visibleProducts.length}</span> products found
                {searchQuery.trim() && (
                  <>
                    {" "}
                    · Search: <span className="text-neutral-900">&ldquo;{searchQuery.trim()}&rdquo;</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                <label className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-neutral-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-neutral-900"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Items per page</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="border border-neutral-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-neutral-900"
                  >
                    {PAGE_SIZES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <p className="text-xs text-neutral-500">
                Showing <strong className="text-neutral-800">{pagedProducts.length}</strong> of{" "}
                {visibleProducts.length}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 bg-neutral-50 px-4 py-2 text-sm text-neutral-600">
            <span>
              Products selected to compare: <strong className="text-neutral-900">0</strong>
            </span>
            <button
              type="button"
              disabled
              className="cursor-not-allowed text-neutral-400 line-through"
              title="Compare is not enabled in this demo"
            >
              Compare
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {pagedProducts.map((product, i) => {
              const pct = discountPercent(product);
              const price = Number(product.price);
              const compare = product.compareAtPrice != null ? Number(product.compareAtPrice) : null;
              const showCompare = compare != null && compare > price;
              const plan = installmentPlan(price);
              const wid = String(product._id);
              return (
                <article
                  key={product._id}
                  className="group flex flex-col border border-neutral-200 bg-white transition hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-neutral-200">
                    <img
                      src={productImageFor(product, i)}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                    {pct > 0 && (
                      <span className="absolute left-2 top-2 bg-red-700 px-2 py-0.5 text-[11px] font-bold text-white">
                        {pct % 1 === 0 ? Math.round(pct) : pct}% OFF
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleWishlist(wid)}
                      className={`absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-neutral-600 shadow-sm transition hover:bg-white ${
                        wishlist.has(wid) ? "!text-red-600" : ""
                      }`}
                      aria-label={wishlist.has(wid) ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <IconHeart filled={wishlist.has(wid)} />
                    </button>
                    {product.badge && (
                      <span className="absolute bottom-2 left-2 bg-white/95 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-800">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
                      {(product.category && CATEGORY_LABELS[product.category]) || "Collection"}
                    </p>
                    <h2 className="mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-normal leading-snug text-neutral-900">
                      {product.name}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="text-[10px] uppercase tracking-wide text-neutral-400">New in</span>
                      {product.category && (
                        <span className="text-[10px] text-neutral-500">· {product.category}</span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      {showCompare && (
                        <span className="text-sm text-neutral-400 line-through">${compare.toFixed(2)}</span>
                      )}
                      <span className="text-base font-semibold text-neutral-900">${price.toFixed(2)}</span>
                    </div>
                    {plan && (
                      <p className="mt-1 text-[11px] text-neutral-500">
                        {plan.n} × ${plan.each.toFixed(2)} interest-free
                      </p>
                    )}
                    <p className="mt-0.5 text-[11px] text-neutral-400">
                      {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                    </p>
                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                      className="mt-3 w-full border border-neutral-900 bg-neutral-900 py-2 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-white hover:text-neutral-900 disabled:cursor-not-allowed disabled:border-neutral-200 disabled:bg-neutral-200 disabled:text-neutral-500"
                    >
                      Add to bag
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {!visibleProducts.length && (
            <p className="mt-16 text-center text-sm text-neutral-500">No products match your filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}
