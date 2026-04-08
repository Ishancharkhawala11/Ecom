import { useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api";
import { setStoredToken } from "../auth/tokenStorage.js";
import { STORE_BRAND } from "../constants/shop.js";

function AuthChromeHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto max-w-[1000px] px-4 py-3">
        <Link to="/" className="text-lg font-semibold tracking-tight text-neutral-900">
          {STORE_BRAND}
        </Link>
      </div>
    </header>
  );
}

function AuthChromeFooter() {
  return (
    <footer className="mt-auto border-t border-neutral-200 bg-zinc-100 py-6">
      <div className="mx-auto flex max-w-[1000px] flex-wrap justify-center gap-x-6 gap-y-2 px-4 text-xs text-neutral-600">
        <Link to="/forgot-password" className="hover:text-neutral-900 hover:underline">
          Help
        </Link>
        <span className="text-neutral-400">·</span>
        <Link to="/login" className="hover:text-neutral-900 hover:underline">
          Sign in
        </Link>
        <span className="text-neutral-400">·</span>
        <span>© {new Date().getFullYear()} {STORE_BRAND}</span>
      </div>
    </footer>
  );
}

function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f1f3f4]">
      <AuthChromeHeader />
      <div className="flex flex-1 flex-col px-4 py-6">{children}</div>
      <AuthChromeFooter />
    </div>
  );
}

const inputClass =
  "w-full rounded-sm border border-zinc-400 bg-white px-3 py-2 text-sm text-neutral-900 shadow-inner outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500";

const btnPrimaryClass =
  "w-full rounded-sm border border-[#FCD200] bg-[#FFD814] py-2 text-sm font-normal text-neutral-900 shadow-sm hover:bg-[#F7CA00] active:border-amber-600 active:bg-[#F0B800]";

function getApiErrorMessage(err, fallback) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.request) return "Unable to reach server. Check backend and CORS configuration.";
  return fallback;
}

function safeNextPath(next) {
  if (!next || typeof next !== "string") return "/";
  if (!next.startsWith("/") || next.startsWith("//")) return "/";
  return next;
}

export function LoginScreen({ setUser }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password, rememberMe });
      setStoredToken(data.token, rememberMe);
      setUser(data.user);
      navigate(safeNextPath(searchParams.get("next")));
    } catch (err) {
      setError(getApiErrorMessage(err, "Something went wrong. Please try again."));
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[350px]">
        <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-normal text-neutral-900">Sign in</h1>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="signin-email" className="block text-sm font-semibold text-neutral-900">
                Email
              </label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label htmlFor="signin-password" className="block text-sm font-semibold text-neutral-900">
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} mt-1`}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-zinc-400"
              />
              Keep me signed in
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" className={btnPrimaryClass}>
              Sign in
            </button>
          </form>
          <div className="mt-4 text-sm">
            <Link to="/forgot-password" className="text-blue-700 hover:text-amber-800 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        <div className="relative mt-4 text-center text-xs text-neutral-600">
          <div className="absolute inset-x-0 top-1/2 border-t border-zinc-300" />
          <span className="relative bg-[#f1f3f4] px-2">New to {STORE_BRAND}?</span>
        </div>
        <Link
          to={{ pathname: "/register", search: search || "?next=%2F" }}
          className="mt-3 block w-full rounded-sm border border-zinc-400 bg-zinc-100 py-2 text-center text-sm text-neutral-900 shadow-sm hover:bg-zinc-200"
        >
          Create your {STORE_BRAND} account
        </Link>
      </div>
    </AuthLayout>
  );
}

export function RegisterScreen({ setUser }) {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [searchParams] = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the conditions of use.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const { data } = await api.post("/auth/register", { name, email, password, rememberMe });
      setStoredToken(data.token, rememberMe);
      setUser(data.user);
      navigate(safeNextPath(searchParams.get("next")));
    } catch (err) {
      setError(getApiErrorMessage(err, "Something went wrong. Please try again."));
    }
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[350px]">
        <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-normal text-neutral-900">Create account</h1>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="reg-name" className="block text-sm font-semibold text-neutral-900">
                Your name
              </label>
              <input
                id="reg-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="block text-sm font-semibold text-neutral-900">
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputClass} mt-1`}
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="block text-sm font-semibold text-neutral-900">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`${inputClass} mt-1`}
              />
              <p className="mt-1 text-xs text-neutral-600">Passwords must be at least 6 characters.</p>
            </div>
            <label className="flex items-start gap-2 text-sm text-neutral-900">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-400"
              />
              Keep me signed in after account creation
            </label>
            <label className="flex items-start gap-2 text-sm text-neutral-900">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-zinc-400"
              />
              <span>
                I agree to the Conditions of Use and Privacy Notice.
              </span>
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button type="submit" className={btnPrimaryClass}>
              Create your {STORE_BRAND} account
            </button>
          </form>
          <p className="mt-4 text-xs text-neutral-600">
            Already have an account?{" "}
            <Link
              to={{ pathname: "/login", search: search || "?next=%2F" }}
              className="text-blue-700 hover:text-amber-800 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}

export function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    setMessage("Password reset email is not configured yet. Contact support or sign in with a known account.");
  };

  return (
    <AuthLayout>
      <div className="mx-auto w-full max-w-[350px]">
        <div className="rounded-sm border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-normal text-neutral-900">Password assistance</h1>
          <p className="mt-2 text-sm text-neutral-700">
            Enter the email address associated with your {STORE_BRAND} account.
          </p>
          <form onSubmit={submit} className="mt-4 space-y-3">
            <div>
              <label htmlFor="forgot-email" className="block text-sm font-semibold text-neutral-900">
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`${inputClass} mt-1`}
              />
            </div>
            <button type="submit" className={btnPrimaryClass}>
              Continue
            </button>
          </form>
          {message && <p className="mt-4 text-sm text-neutral-700">{message}</p>}
          <div className="mt-4 text-sm">
            <Link to="/login" className="text-blue-700 hover:underline">
              Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
