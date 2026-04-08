function normalizeAddressInput(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      line1: "",
      line2: "",
      city: "",
      region: "",
      postalCode: "",
      country: ""
    };
  }
  return {
    line1: String(raw.line1 ?? "").trim(),
    line2: String(raw.line2 ?? "").trim(),
    city: String(raw.city ?? "").trim(),
    region: String(raw.region ?? "").trim(),
    postalCode: String(raw.postalCode ?? "").trim(),
    country: String(raw.country ?? "").trim()
  };
}

function isCompleteAddress(a) {
  return !!(a && a.line1 && a.city && a.postalCode && a.country);
}

module.exports = { normalizeAddressInput, isCompleteAddress };
