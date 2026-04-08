export function isCompleteAddrFields(a) {
  if (!a || typeof a !== "object") return false;
  return Boolean(
    String(a.line1 || "").trim() &&
      String(a.city || "").trim() &&
      String(a.postalCode || "").trim() &&
      String(a.country || "").trim()
  );
}

/** @deprecated use hasAnySavedAddress */
export function hasCompleteShippingAddress(user) {
  return hasAnySavedAddress(user);
}

export function listDeliverableAddresses(user) {
  const raw = user?.addresses;
  if (!Array.isArray(raw)) return [];
  return raw.filter(isCompleteAddrFields);
}

export function hasAnySavedAddress(user) {
  return listDeliverableAddresses(user).length > 0;
}

export function formatAddressOneLine(addr) {
  if (!addr) return "";
  const parts = [
    addr.line1,
    addr.line2,
    [addr.city, addr.region].filter(Boolean).join(", "),
    [addr.postalCode, addr.country].filter(Boolean).join(" ")
  ].filter((p) => p && String(p).trim());
  return parts.join(", ");
}
