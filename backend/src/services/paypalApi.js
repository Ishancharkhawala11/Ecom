const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

let cached = { token: null, expiresAt: 0 };

function isConfigured() {
  return Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
}

async function getAccessToken() {
  if (!isConfigured()) {
    const err = new Error("PayPal is not configured");
    err.statusCode = 503;
    throw err;
  }
  if (cached.token && Date.now() < cached.expiresAt) {
    return cached.token;
  }
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  const auth = Buffer.from(`${id}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error_description || data.error || "PayPal token request failed");
    err.statusCode = 502;
    throw err;
  }
  cached = {
    token: data.access_token,
    expiresAt: Date.now() + Math.max(0, (data.expires_in || 300) - 60) * 1000
  };
  return cached.token;
}

async function paypalFetch(path, options = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issue = data?.details?.[0]?.issue;
    const description = data?.details?.[0]?.description;
    const msg = [issue, description, data?.message].filter(Boolean).join(" - ") || JSON.stringify(data);
    const err = new Error(typeof msg === "string" ? msg : "PayPal API error");
    err.statusCode = 502;
    err.paypalDetails = data;
    throw err;
  }
  return data;
}

function getCurrency() {
  // Sandbox merchant accounts are most reliable with USD.
  if ((process.env.PAYPAL_MODE || "").toLowerCase() !== "live") {
    return "USD";
  }
  return (process.env.PAYPAL_CURRENCY || "USD").toUpperCase();
}

function getBrandName() {
  return (process.env.PAYPAL_BRAND_NAME || process.env.STORE_NAME || "Test Store").trim();
}

async function createPayPalOrder(amountValue, currency) {
  const value = Number(amountValue).toFixed(2);
  const brandName = getBrandName();
  const merchantEmail = (process.env.PAYPAL_MERCHANT_EMAIL || "").trim();
  const merchantId = (process.env.PAYPAL_MERCHANT_ID || "").trim();
  const payee = {};
  if (merchantEmail && merchantEmail.includes("@")) payee.email_address = merchantEmail;
  if (merchantId) payee.merchant_id = merchantId;

  return paypalFetch("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      application_context: {
        brand_name: brandName,
        landing_page: "LOGIN",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING"
      },
      purchase_units: [
        {
          ...(Object.keys(payee).length ? { payee } : {}),
          amount: {
            currency_code: currency,
            value
          }
        }
      ]
    })
  });
}

async function capturePayPalOrder(paypalOrderId) {
  return paypalFetch(`/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    body: JSON.stringify({})
  });
}

function extractCaptureId(captureResponse) {
  try {
    const cap =
      captureResponse?.purchase_units?.[0]?.payments?.captures?.[0];
    return cap?.id || "";
  } catch (_) {
    return "";
  }
}

module.exports = {
  isConfigured,
  getCurrency,
  getBrandName,
  createPayPalOrder,
  capturePayPalOrder,
  extractCaptureId,
  PAYPAL_BASE
};
