const KEY = "token";

export function getStoredToken() {
  return localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
}

export function setStoredToken(token, rememberMe) {
  clearStoredToken();
  if (rememberMe) localStorage.setItem(KEY, token);
  else sessionStorage.setItem(KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(KEY);
  sessionStorage.removeItem(KEY);
}
