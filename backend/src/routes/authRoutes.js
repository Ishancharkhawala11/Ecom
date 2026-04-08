const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { normalizeAddressInput, isCompleteAddress } = require("../utils/address");

const router = express.Router();

const publicUser = (doc) => {
  const addresses = (doc.savedAddresses || []).map((a) => ({
    id: String(a._id),
    label: a.label || "Home",
    line1: a.line1 || "",
    line2: a.line2 || "",
    city: a.city || "",
    region: a.region || "",
    postalCode: a.postalCode || "",
    country: a.country || ""
  }));
  const first = addresses[0];
  const address = first
    ? {
        line1: first.line1,
        line2: first.line2,
        city: first.city,
        region: first.region,
        postalCode: first.postalCode,
        country: first.country
      }
    : normalizeAddressInput(doc.address);

  return {
    id: doc._id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    addresses,
    address
  };
};

async function migrateLegacyAddress(user) {
  const legacy = normalizeAddressInput(user.address);
  if ((!user.savedAddresses || user.savedAddresses.length === 0) && isCompleteAddress(legacy)) {
    user.savedAddresses.push({
      label: "Home",
      line1: legacy.line1,
      line2: legacy.line2,
      city: legacy.city,
      region: legacy.region,
      postalCode: legacy.postalCode,
      country: legacy.country
    });
    await user.save();
  }
}

const signToken = (userId, rememberMe = true) => {
  const expiresIn = rememberMe ? "30d" : "1d";
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const rememberMe = req.body.rememberMe !== false;
    const token = signToken(user._id, rememberMe);
    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, adminSecret } = req.body;
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });
    const token = signToken(user._id);
    return res.status(201).json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const rememberMe = req.body.rememberMe !== false;
    const token = signToken(user._id, rememberMe);
    await migrateLegacyAddress(user);
    return res.json({
      token,
      user: publicUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/profile", protect, async (req, res) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== "object") {
      return res.status(400).json({ message: "Address is required" });
    }
    const normalized = normalizeAddressInput(address);
    if (!isCompleteAddress(normalized)) {
      return res.status(400).json({
        message: "Address needs street line, city, postal code, and country"
      });
    }
    const user = await User.findById(req.user._id);
    if (!user.savedAddresses.length) {
      user.savedAddresses.push({
        label: "Home",
        line1: normalized.line1,
        line2: normalized.line2,
        city: normalized.city,
        region: normalized.region,
        postalCode: normalized.postalCode,
        country: normalized.country
      });
    } else {
      const first = user.savedAddresses[0];
      first.line1 = normalized.line1;
      first.line2 = normalized.line2;
      first.city = normalized.city;
      first.region = normalized.region;
      first.postalCode = normalized.postalCode;
      first.country = normalized.country;
    }
    user.address = normalized;
    await user.save();
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/addresses", protect, async (req, res) => {
  try {
    const normalized = normalizeAddressInput(req.body);
    if (!isCompleteAddress(normalized)) {
      return res.status(400).json({
        message: "Address needs street line, city, postal code, and country"
      });
    }
    const user = await User.findById(req.user._id);
    if ((user.savedAddresses || []).length >= 3) {
      return res.status(400).json({ message: "You can save up to 3 addresses" });
    }
    const label = String(req.body.label || "Home")
      .trim()
      .slice(0, 40);
    user.savedAddresses.push({
      label,
      line1: normalized.line1,
      line2: normalized.line2,
      city: normalized.city,
      region: normalized.region,
      postalCode: normalized.postalCode,
      country: normalized.country
    });
    await user.save();
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.patch("/addresses/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sub = user.savedAddresses.id(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Address not found" });
    }
    const merged = normalizeAddressInput({
      line1: req.body.line1 ?? sub.line1,
      line2: req.body.line2 ?? sub.line2,
      city: req.body.city ?? sub.city,
      region: req.body.region ?? sub.region,
      postalCode: req.body.postalCode ?? sub.postalCode,
      country: req.body.country ?? sub.country
    });
    if (!isCompleteAddress(merged)) {
      return res.status(400).json({ message: "Address fields are incomplete" });
    }
    if (req.body.label != null) {
      sub.label = String(req.body.label).trim().slice(0, 40) || "Home";
    }
    sub.line1 = merged.line1;
    sub.line2 = merged.line2;
    sub.city = merged.city;
    sub.region = merged.region;
    sub.postalCode = merged.postalCode;
    sub.country = merged.country;
    await user.save();
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete("/addresses/:id", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const sub = user.savedAddresses.id(req.params.id);
    if (!sub) {
      return res.status(404).json({ message: "Address not found" });
    }
    user.savedAddresses.pull({ _id: req.params.id });
    await user.save();
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  await migrateLegacyAddress(user);
  return res.json({ user: publicUser(user) });
});

module.exports = router;
