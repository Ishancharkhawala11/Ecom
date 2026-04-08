/**
 * Seeds catalog via the same HTTP API the admin panel uses:
 * POST /api/auth/login (after optional POST /api/auth/register-admin)
 * POST /api/products (Bearer token, admin role)
 *
 * Env (backend .env or shell):
 *   API_BASE_URL — default http://127.0.0.1:5000
 *   SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD — optional if ADMIN_SECRET is set (non-production):
 *       defaults seed-admin@ecom.local / ChangeMeSeed!456 and register-admin is attempted first
 *   SEED_ADMIN_NAME — optional, default "Seed Admin"
 *   ADMIN_SECRET — if set, tries register-admin first (ignores "email already exists")
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const baseUrl = (process.env.API_BASE_URL || "http://127.0.0.1:5000").replace(/\/$/, "");

const DEFAULT_SEED_EMAIL = "seed-admin@ecom.local";
const DEFAULT_SEED_PASSWORD = "ChangeMeSeed!456";

const SAMPLE_PRODUCTS = [
  {
    name: "Wireless earbuds",
    description: "Bluetooth 5.3, active noise cancellation, 28h battery with case.",
    price: 79.99,
    stock: 120,
    category: "electronics",
    imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80",
    compareAtPrice: 99.99,
    badge: "Sale"
  },
  {
    name: "Ceramic pour-over set",
    description: "Dripper, server, and filters for café-style coffee at home.",
    price: 42.5,
    stock: 45,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
    badge: "New"
  },
  {
    name: "Organic cotton tee",
    description: "Relaxed fit, garment-dyed, made from GOTS-certified cotton.",
    price: 34,
    stock: 200,
    category: "apparel",
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
  },
  {
    name: "Stainless water bottle",
    description: "Insulated 24oz, leak-proof cap, dishwasher safe.",
    price: 28.99,
    stock: 80,
    category: "general",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80"
  },
  {
    name: "Desk lamp LED",
    description: "Warm/cool modes, touch dimmer, USB-C charging port in base.",
    price: 56,
    stock: 60,
    category: "home",
    imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    compareAtPrice: 69
  },
  {
    name: "Running shoes",
    description: "Lightweight mesh upper, cushioned midsole for daily miles.",
    price: 112,
    stock: 35,
    category: "apparel",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"
  }
];

async function jsonFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }
  return { res, data };
}

async function ensureAdminToken() {
  const name = process.env.SEED_ADMIN_NAME || "Seed Admin";
  const secret = process.env.ADMIN_SECRET;
  const useDevDefaults =
    process.env.NODE_ENV !== "production" && secret && !process.env.SEED_ADMIN_EMAIL;

  const email =
    process.env.SEED_ADMIN_EMAIL || (useDevDefaults ? DEFAULT_SEED_EMAIL : null);
  const password =
    process.env.SEED_ADMIN_PASSWORD || (useDevDefaults ? DEFAULT_SEED_PASSWORD : null);

  if (!email || !password) {
    console.error(
      "Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD, or use non-production .env with ADMIN_SECRET for dev defaults."
    );
    process.exit(1);
  }

  if (secret) {
    await jsonFetch(`${baseUrl}/api/auth/register-admin`, {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        adminSecret: secret
      })
    });
  }

  const { res, data } = await jsonFetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    console.error("Login failed:", res.status, data);
    console.error(
      "Create an admin with POST /api/auth/register-admin (ADMIN_SECRET) or fix credentials."
    );
    process.exit(1);
  }

  if (data.user?.role !== "admin") {
    console.error("User is not admin; product POST requires role admin.");
    process.exit(1);
  }

  return data.token;
}

async function main() {
  const health = await jsonFetch(`${baseUrl}/api/health`);
  if (!health.res.ok) {
    console.error(`API not reachable at ${baseUrl}. Start the backend (npm run dev in backend).`);
    process.exit(1);
  }

  const token = await ensureAdminToken();

  for (const body of SAMPLE_PRODUCTS) {
    const { res, data } = await jsonFetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      console.error("Failed to create:", body.name, res.status, data);
      process.exit(1);
    }
    console.log("Created:", data.name, `($${data.price})`);
  }

  console.log(`Done. ${SAMPLE_PRODUCTS.length} products seeded via API.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
