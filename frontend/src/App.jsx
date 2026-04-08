import { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import api from "./api";
import { clearStoredToken, getStoredToken } from "./auth/tokenStorage.js";
import { GUEST_CART_KEY } from "./constants/cart.js";
import { CartDrawer } from "./components/shopfront/CartDrawer.jsx";
import { ShopfrontFooter } from "./components/shopfront/ShopfrontFooter.jsx";
import { ShopfrontNavbar } from "./components/shopfront/ShopfrontNavbar.jsx";
import { ForgotPasswordScreen, LoginScreen, RegisterScreen } from "./pages/AuthScreens.jsx";
import { AddressesPage } from "./pages/AddressesPage.jsx";
import { PendingOrdersPage } from "./pages/PendingOrdersPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";

const ProtectedRoute = ({ user, children }) => (user ? children : <Navigate to="/login" replace />);

const AUTH_PATHS = ["/login", "/register", "/forgot-password"];

function readGuestCart() {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return [];
}

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  const load = async () => {
    const { data } = await api.get("/notifications");
    setNotifications(data);
  };

  useEffect(() => {
    load();
    const timer = setInterval(load, 10000);
    return () => clearInterval(timer);
  }, []);

  const markRead = async (id) => {
    await api.patch(`/notifications/${id}/read`);
    load();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h2 className="text-2xl font-bold text-neutral-900">Notifications</h2>
      <div className="mt-6 flex flex-col gap-4">
        {notifications.map((item) => (
          <div key={item._id} className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h4 className="font-semibold text-neutral-900">{item.title}</h4>
            <p className="mt-1 text-sm text-neutral-600">{item.message}</p>
            <small className="mt-2 block text-xs text-neutral-400">
              {new Date(item.createdAt).toLocaleString()}
            </small>
            {!item.read && (
              <button
                type="button"
                onClick={() => markRead(item._id)}
                className="mt-3 rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAuthRoute = AUTH_PATHS.includes(pathname);

  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(() => (getStoredToken() ? [] : readGuestCart()));
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [shopCategoryFilter, setShopCategoryFilter] = useState(null);

  const adminPanelUrl = import.meta.env.VITE_ADMIN_PANEL_URL || "http://localhost:5174";
  const loginRedirect = { pathname: "/login", search: `?next=${encodeURIComponent("/")}` };

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  useEffect(() => {
    const loadUser = async () => {
      const token = getStoredToken();
      if (!token) return;
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.user);
      } catch (_error) {
        clearStoredToken();
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (!user) {
      try {
        localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
      } catch (_) {}
    }
  }, [cart, user]);

  useEffect(() => {
    if (user) localStorage.removeItem(GUEST_CART_KEY);
  }, [user]);

  const logout = () => {
    clearStoredToken();
    setUser(null);
    try {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    } catch (_) {}
  };

  const refreshUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch (_err) {
      clearStoredToken();
      setUser(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {!isAuthRoute && (
        <>
          <ShopfrontNavbar
            user={user}
            cartCount={cartCount}
            onLogout={logout}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onOpenCart={() => setCartOpen(true)}
            onCategoryNavigate={setShopCategoryFilter}
            adminPanelUrl={adminPanelUrl}
          />
          <CartDrawer
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            cart={cart}
            setCart={setCart}
            user={user}
            loginRedirect={loginRedirect}
            onUserRefresh={refreshUser}
            onRequireSignIn={() => {
              navigate(loginRedirect);
              setCartOpen(false);
            }}
          />
        </>
      )}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <ShopPage
                cart={cart}
                setCart={setCart}
                searchQuery={searchQuery}
                onOpenCart={() => setCartOpen(true)}
                categoryFilter={shopCategoryFilter}
                setCategoryFilter={setShopCategoryFilter}
              />
            }
          />
          <Route path="/login" element={<LoginScreen setUser={setUser} />} />
          <Route path="/register" element={<RegisterScreen setUser={setUser} />} />
          <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute user={user}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute user={user}>
                <PendingOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute user={user}>
                <AddressesPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isAuthRoute && <ShopfrontFooter />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
