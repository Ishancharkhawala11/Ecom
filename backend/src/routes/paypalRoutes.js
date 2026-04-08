const express = require("express");
const { protect } = require("../middleware/auth");
const { prepareOrderPayload, finalizeShopOrder } = require("../services/orderService");
const {
  isConfigured,
  getCurrency,
  createPayPalOrder,
  capturePayPalOrder,
  extractCaptureId
} = require("../services/paypalApi");

const router = express.Router();

router.get("/config", (_req, res) => {
  if (!isConfigured()) {
    return res.json({ enabled: false, clientId: "", currency: getCurrency() });
  }
  res.json({
    enabled: true,
    clientId: process.env.PAYPAL_CLIENT_ID,
    currency: getCurrency()
  });
});

router.post("/create-order", protect, async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: "PayPal is not configured on the server" });
    }
    const { items, shippingAddress, addressId } = req.body;
    console.log("[paypal/create-order] start", {
      userId: String(req.user?._id || ""),
      itemCount: Array.isArray(items) ? items.length : 0,
      addressId: addressId || null
    });
    const { totalAmount } = await prepareOrderPayload(req.user._id, items, {
      shippingAddress,
      addressId
    });
    const currency = getCurrency();
    const paypalOrder = await createPayPalOrder(totalAmount, currency);
    console.log("[paypal/create-order] success", {
      orderId: paypalOrder?.id || "",
      currency,
      totalAmount
    });
    return res.json({ id: paypalOrder.id });
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("[paypal/create-order] failed", {
      message: error.message,
      code,
      details: error.paypalDetails || null,
      detailsJson: error.paypalDetails ? JSON.stringify(error.paypalDetails) : null
    });
    return res.status(code).json({ message: error.message });
  }
});

router.post("/capture-order", protect, async (req, res) => {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: "PayPal is not configured on the server" });
    }
    const { orderID, items, shippingAddress, addressId } = req.body;
    console.log("[paypal/capture-order] start", {
      userId: String(req.user?._id || ""),
      orderID: orderID || "",
      itemCount: Array.isArray(items) ? items.length : 0
    });
    if (!orderID) {
      return res.status(400).json({ message: "orderID is required" });
    }
    const captureResponse = await capturePayPalOrder(orderID);
    if (captureResponse.status !== "COMPLETED") {
      return res.status(400).json({ message: "Payment was not completed" });
    }
    const captureId = extractCaptureId(captureResponse);
    const order = await finalizeShopOrder(
      req.user._id,
      items,
      { shippingAddress, addressId },
      {
        paypalOrderId: orderID,
        paypalCaptureId: captureId
      }
    );
    console.log("[paypal/capture-order] success", {
      orderID,
      captureId
    });
    return res.status(201).json(order);
  } catch (error) {
    const code = error.statusCode || 500;
    console.error("[paypal/capture-order] failed", {
      message: error.message,
      code,
      details: error.paypalDetails || null,
      detailsJson: error.paypalDetails ? JSON.stringify(error.paypalDetails) : null
    });
    return res.status(code).json({ message: error.message });
  }
});

module.exports = router;
