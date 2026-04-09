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

async function createHandler(req, res) {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: "PayPal is not configured on the server" });
    }
    const { items, shippingAddress, addressId } = req.body;
    const { totalAmount } = await prepareOrderPayload(req.user._id, items, {
      shippingAddress,
      addressId
    });
    const currency = getCurrency();
    const paypalOrder = await createPayPalOrder(totalAmount, currency);
    return res.json({ id: paypalOrder.id });
  } catch (error) {
    console.error("[paypal/create] failed", error);
    const code = error.statusCode || 500;
    return res.status(code).json({ message: error.message || "PayPal payment creation failed" });
  }
}

async function captureHandler(req, res) {
  try {
    if (!isConfigured()) {
      return res.status(503).json({ message: "PayPal is not configured on the server" });
    }
    const { orderID, items, shippingAddress, addressId } = req.body;
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
    return res.status(201).json(order);
  } catch (error) {
    console.error("[paypal/capture] failed", error);
    const code = error.statusCode || 500;
    return res.status(code).json({ message: error.message || "PayPal capture failed" });
  }
}

router.post("/create", protect, createHandler);
router.post("/create-order", protect, createHandler);
router.post("/capture", protect, captureHandler);
router.post("/capture-order", protect, captureHandler);

module.exports = router;
