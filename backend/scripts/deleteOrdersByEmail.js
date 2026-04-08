/**
 * Usage: node scripts/deleteOrdersByEmail.js <email>
 * Deletes all Order documents for that user (by email). Does not delete the user account.
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const User = require("../src/models/User");
const Order = require("../src/models/Order");

const email = (process.argv[2] || "").trim().toLowerCase();
const uri = process.env.MONGO_URI || process.env.MONGODB_URI;

async function main() {
  if (!email) {
    console.error("Usage: node scripts/deleteOrdersByEmail.js <email>");
    process.exit(1);
  }
  if (!uri) {
    console.error("MONGO_URI or MONGODB_URI missing in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  const result = await Order.deleteMany({ user: user._id });
  console.log(`Deleted ${result.deletedCount} order(s) for ${email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
