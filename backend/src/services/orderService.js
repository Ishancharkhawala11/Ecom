const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Notification = require("../models/Notification");
const { normalizeAddressInput, isCompleteAddress } = require("../utils/address");

function normalizeCheckout(third) {
  if (third == null || typeof third !== "object" || Array.isArray(third)) return {};
  if ("addressId" in third || "shippingAddress" in third) {
    return {
      shippingAddress: third.shippingAddress,
      addressId: third.addressId != null ? String(third.addressId) : null
    };
  }
  if ("line1" in third) {
    return { shippingAddress: third, addressId: null };
  }
  return {};
}

/**
 * Validates cart lines and address; loads products and checks stock (no writes).
 */
async function prepareOrderPayload(userId, itemsInput, checkoutRaw) {
  const checkout = normalizeCheckout(checkoutRaw);

  if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
    const err = new Error("Order items are required");
    err.statusCode = 400;
    throw err;
  }

  const userDoc = await User.findById(userId);
  if (!userDoc) {
    const err = new Error("User not found");
    err.statusCode = 401;
    throw err;
  }

  const addressId = checkout.addressId || null;
  const fromBody = normalizeAddressInput(checkout.shippingAddress);

  let usedSavedId = null;
  let shippingAddress = null;

  if (addressId) {
    const sub = (userDoc.savedAddresses || []).find((a) => String(a._id) === addressId);
    if (!sub) {
      const err = new Error("Selected address not found");
      err.statusCode = 400;
      throw err;
    }
    shippingAddress = normalizeAddressInput(sub);
    usedSavedId = String(sub._id);
  } else if (isCompleteAddress(fromBody)) {
    shippingAddress = fromBody;
  } else {
    const legacy = normalizeAddressInput(userDoc.address);
    if (isCompleteAddress(legacy)) {
      shippingAddress = legacy;
    }
  }

  if (!shippingAddress) {
    const err = new Error("Choose a saved address or enter a full shipping address to continue");
    err.statusCode = 400;
    throw err;
  }

  const productIds = itemsInput.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const lines = [];
  let totalAmount = 0;

  for (const item of itemsInput) {
    const product = productMap.get(item.productId);
    if (!product) {
      const err = new Error("Product not found");
      err.statusCode = 404;
      throw err;
    }
    if (product.stock < item.quantity) {
      const err = new Error(`Not enough stock for ${product.name}`);
      err.statusCode = 400;
      throw err;
    }
    lines.push({
      productDoc: product,
      quantity: item.quantity,
      price: product.price
    });
    totalAmount += product.price * item.quantity;
  }

  return { shippingAddress, lines, totalAmount, userDoc, fromBody, usedSavedId };
}

async function maybeSaveUserAddress(userDoc, fromBody, usedSavedId) {
  if (!isCompleteAddress(fromBody) || usedSavedId) return;
  const list = userDoc.savedAddresses || [];
  const norm = normalizeAddressInput(fromBody);
  const exists = list.some(
    (a) => JSON.stringify(normalizeAddressInput(a)) === JSON.stringify(norm)
  );
  if (exists) return;
  if (list.length < 3) {
    userDoc.savedAddresses.push({
      label: `Address ${list.length + 1}`,
      line1: norm.line1,
      line2: norm.line2,
      city: norm.city,
      region: norm.region,
      postalCode: norm.postalCode,
      country: norm.country
    });
    await userDoc.save();
  } else {
    userDoc.address = norm;
    await userDoc.save();
  }
}

async function finalizeShopOrder(userId, itemsInput, checkoutRaw, paypalMeta) {
  const { shippingAddress, lines, totalAmount, userDoc, fromBody, usedSavedId } =
    await prepareOrderPayload(userId, itemsInput, checkoutRaw);

  await maybeSaveUserAddress(userDoc, fromBody, usedSavedId);

  for (const line of lines) {
    line.productDoc.stock -= line.quantity;
    await line.productDoc.save();
  }

  const normalizedItems = lines.map((line) => ({
    product: line.productDoc._id,
    quantity: line.quantity,
    price: line.price
  }));

  const order = await Order.create({
    user: userId,
    items: normalizedItems,
    totalAmount,
    shippingAddress,
    paypalOrderId: paypalMeta?.paypalOrderId,
    paypalCaptureId: paypalMeta?.paypalCaptureId
  });

  await Notification.create({
    user: userId,
    title: "Order placed",
    message: `Your order ${order._id} has been placed successfully.`,
    type: "order"
  });

  return order;
}

module.exports = { prepareOrderPayload, finalizeShopOrder, maybeSaveUserAddress, normalizeCheckout };
