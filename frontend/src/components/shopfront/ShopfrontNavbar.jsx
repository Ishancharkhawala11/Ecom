import { useState } from "react";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_MIN_USD, POPULAR_SEARCHES, STORE_BRAND } from "../../constants/shop.js";

function IconSearch(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

function IconBag(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M6 7h15l-1.5 12.5a2 2 0 01-2 1.5H8.5a2 2 0 01-2-1.5L6 7z" strokeLinejoin="round" />
      <path d="M9 7V5a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function IconChevronDown(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden {...props}>
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const MEGA_LINKS = [
  {
    label: "Clothing",
    href: "/",
    filter: "clothing",
    children: [
      { label: "All clothing", filter: "clothing" },
      { label: "Shirts & polos", filter: "clothing" },
      { label: "Pants & jeans", filter: "clothing" }
    ]
  },
  {
    label: "Home",
    href: "/",
    filter: "home",
    children: [{ label: "All home", filter: "home" }]
  },
  {
    label: "Accessories",
    href: "/",
    filter: "accessories",
    children: [{ label: "All accessories", filter: "accessories" }]
  }
];

export function ShopfrontNavbar({
  user,
  cartCount,
  onLogout,
  searchQuery,
  onSearchChange,
  onOpenCart,
  onCategoryNavigate,
  adminPanelUrl = "http://localhost:5174"
}) {
  const [megaOpen, setMegaOpen] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="bg-neutral-950 py-2 text-center text-[11px] font-medium tracking-wide text-neutral-200 sm:text-xs">
        Free shipping on orders over ${FREE_SHIPPING_MIN_USD} · Same-day dispatch on select items
      </div>
      <div className="border-b border-neutral-200 bg-amber-50 py-1.5 text-center text-[11px] text-neutral-800 sm:text-xs">
        Earn member rewards — sign in to track orders and unlock notifications
      </div>

      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 lg:px-8">
          <button
            type="button"
            className="rounded p-2 text-neutral-700 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Open menu"
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
            <span className="mt-1 block h-0.5 w-5 bg-current" />
          </button>

          <Link
            to="/"
            className="font-serif text-xl font-semibold tracking-[0.08em] text-neutral-900 sm:text-2xl"
            onClick={() => {
              onCategoryNavigate?.(null);
              setMobileOpen(false);
            }}
          >
            {STORE_BRAND}
          </Link>

          <nav className="relative hidden flex-1 justify-center gap-1 lg:flex">
            <Link
              to="/"
              className="px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
              onClick={() => onCategoryNavigate?.(null)}
            >
              New in
            </Link>
            {MEGA_LINKS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setMegaOpen(item.label)}
                onMouseLeave={() => setMegaOpen(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-0.5 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-950"
                >
                  {item.label}
                  <IconChevronDown className="h-4 w-4 opacity-60" />
                </button>
                {megaOpen === item.label && (
                  <div className="absolute left-0 top-full z-50 min-w-[200px] border border-neutral-200 bg-white py-2 shadow-lg">
                    {item.children.map((c) => (
                      <Link
                        key={c.label}
                        to="/"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                        onClick={() => {
                          onCategoryNavigate?.(c.filter);
                          setMegaOpen(null);
                        }}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {user?.role === "admin" && (
              <a
                href={adminPanelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 text-sm font-medium text-amber-900 hover:underline"
              >
                Admin panel
              </a>
            )}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial lg:min-w-[280px]">
            <label className="relative hidden min-w-0 flex-1 md:block">
              <span className="sr-only">Search</span>
              <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search the store…"
                className="w-full border border-neutral-300 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-neutral-900 focus:bg-white"
              />
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="hidden rounded border border-transparent px-2 py-2 text-sm text-neutral-700 hover:border-neutral-200 sm:block"
              >
                My account
              </button>
              {accountOpen && (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-40 cursor-default sm:hidden"
                    aria-label="Close"
                    onClick={() => setAccountOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-1 w-48 border border-neutral-200 bg-white py-1 shadow-lg sm:right-0">
                    {user ? (
                      <>
                        <span className="block px-3 py-2 text-xs text-neutral-500">Signed in</span>
                        <Link
                          to="/orders"
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Your orders
                        </Link>
                        <Link
                          to="/addresses"
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Saved addresses
                        </Link>
                        <Link
                          to="/notifications"
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Notifications
                        </Link>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-sm hover:bg-neutral-50"
                          onClick={() => {
                            setAccountOpen(false);
                            onLogout();
                          }}
                        >
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to={{ pathname: "/login", search: "?next=%2F" }}
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Sign in
                        </Link>
                        <Link
                          to="/register"
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Register
                        </Link>
                        <Link
                          to="/forgot-password"
                          className="block px-3 py-2 text-sm hover:bg-neutral-50"
                          onClick={() => setAccountOpen(false)}
                        >
                          Password help
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-1 border border-neutral-300 bg-white px-2 py-2 text-neutral-900 transition hover:border-neutral-900 sm:px-3"
              aria-label={`Cart, ${cartCount} items`}
            >
              <IconBag className="h-5 w-5" />
              <span className="text-sm font-semibold tabular-nums">{cartCount}</span>
            </button>

            {!user && (
              <Link
                to={{ pathname: "/login", search: "?next=%2F" }}
                className="hidden rounded bg-neutral-900 px-3 py-2 text-sm font-semibold text-white sm:inline-block"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>

        <div className="border-t border-neutral-100 px-4 py-2 md:hidden">
          <label className="relative block">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search…"
              className="w-full border border-neutral-300 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-neutral-900"
            />
          </label>
        </div>

        <div className="hidden border-t border-neutral-100 bg-neutral-50 px-4 py-2 lg:block">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-2 lg:px-8">
            <span className="text-xs font-medium text-neutral-500">Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearchChange(term)}
                className="text-xs text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-950"
              >
                {term}
              </button>
            ))}
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="ml-auto text-xs font-medium text-red-700 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="border-t border-neutral-200 bg-white lg:hidden">
            <div className="flex flex-col px-4 py-3">
              <Link to="/" className="py-2 text-sm font-medium" onClick={() => setMobileOpen(false)}>
                New in
              </Link>
              {MEGA_LINKS.map((item) => (
                <div key={item.label} className="border-t border-neutral-100 py-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">{item.label}</p>
                  {item.children.map((c) => (
                    <Link
                      key={c.label}
                      to="/"
                      className="block py-1.5 text-sm text-neutral-800"
                      onClick={() => {
                        onCategoryNavigate?.(c.filter);
                        setMobileOpen(false);
                      }}
                    >
                      {c.label}
                    </Link>
                  ))}
                </div>
              ))}
              {user?.role === "admin" && (
                <a
                  href={adminPanelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-2 text-sm text-amber-900"
                  onClick={() => setMobileOpen(false)}
                >
                  Admin panel
                </a>
              )}
              {user && (
                <>
                  <Link
                    to="/orders"
                    className="block border-t border-neutral-100 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Your orders
                  </Link>
                  <Link
                    to="/addresses"
                    className="block border-t border-neutral-100 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Saved addresses
                  </Link>
                  <Link
                    to="/notifications"
                    className="block border-t border-neutral-100 py-2 text-sm"
                    onClick={() => setMobileOpen(false)}
                  >
                    Notifications
                  </Link>
                  <button
                    type="button"
                    className="w-full border-t border-neutral-100 py-2 text-left text-sm"
                    onClick={() => {
                      setMobileOpen(false);
                      onLogout();
                    }}
                  >
                    Log out
                  </button>
                </>
              )}
              {!user && (
                <Link
                  to={{ pathname: "/login", search: "?next=%2F" }}
                  className="block border-t border-neutral-100 py-2 text-sm font-semibold"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
