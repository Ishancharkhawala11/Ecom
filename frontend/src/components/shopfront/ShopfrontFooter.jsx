import { useState } from "react";
import { Link } from "react-router-dom";
import { FREE_SHIPPING_MIN_USD, STORE_BRAND } from "../../constants/shop.js";

export function ShopfrontFooter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const submitNewsletter = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <footer className="mt-auto border-t border-neutral-300 bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-[1400px] px-4 py-12 lg:px-8">
        <div className="border-b border-neutral-800 pb-10">
          <p className="font-serif text-lg tracking-wide text-white">{STORE_BRAND}</p>
          <p className="mt-2 max-w-md text-sm text-neutral-400">
            Newsletter — get new arrivals and offers. (Demo: this form does not send email; connect your backend when
            ready.)
          </p>
          {sent ? (
            <p className="mt-4 text-sm text-emerald-400">Thanks — you&apos;re on the list.</p>
          ) : (
            <form onSubmit={submitNewsletter} className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 border border-neutral-600 bg-neutral-900 px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:border-white focus:outline-none"
              />
              <button
                type="submit"
                className="border border-white bg-white px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-neutral-200"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className="grid gap-10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">My account</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/register" className="hover:text-white">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-white">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Shop</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white">
                  New arrivals
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Free shipping over ${FREE_SHIPPING_MIN_USD}</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Support</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link to="/forgot-password" className="hover:text-white">
                  Password help
                </Link>
              </li>
              <li>
                <span className="text-neutral-500">Returns — contact support via your order history (demo).</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white">Contact</h3>
            <ul className="mt-3 space-y-2 text-sm text-neutral-400">
              <li>Mon – Fri · 9am – 6pm</li>
              <li>
                <a href="mailto:support@example.com" className="hover:text-white">
                  support@example.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-[11px] text-neutral-500">
        © {new Date().getFullYear()} {STORE_BRAND} · Demo store · All rights reserved
      </div>
    </footer>
  );
}
