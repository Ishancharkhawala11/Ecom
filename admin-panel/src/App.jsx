import { useEffect, useState } from "react";
import api from "./api";

function LoginView({ onLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password, rememberMe: true });
      if (data.user?.role !== "admin") {
        setError("This account is not an administrator.");
        return;
      }
      localStorage.setItem("admin_token", data.token);
      onLoggedIn(data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Sign in failed.");
    }
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h1>Store admin</h1>
        <p className="muted">Sign in with an admin account. Customer accounts cannot access this panel.</p>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <p className="error">{error}</p>}
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "general",
    compareAtPrice: "",
    badge: "",
    imageUrl: ""
  });
  const [formError, setFormError] = useState("");
  const [activePage, setActivePage] = useState("add");
  const [editingId, setEditingId] = useState(null);
  const resetForm = () =>
    setForm({
      name: "",
      price: "",
      stock: "",
      description: "",
      category: "general",
      compareAtPrice: "",
      badge: "",
      imageUrl: ""
    });

  const validateRequiredFields = () => {
    if (!form.name.trim()) return "Name is required.";
    if (!form.description.trim()) return "Description is required.";
    if (!form.category.trim()) return "Category is required.";
    if (form.price === "" || form.price == null) return "Sale price is required.";
    if (form.stock === "" || form.stock == null) return "Stock is required.";
    return "";
  };

  const loadAll = async () => {
    const [statsRes, productsRes] = await Promise.all([
      api.get("/admin/dashboard"),
      api.get("/products")
    ]);
    setStats(statsRes.data);
    setProducts(productsRes.data);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    setFormError("");
    const requiredError = validateRequiredFields();
    if (requiredError) {
      setFormError(requiredError);
      return;
    }
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Sale price must be 0 or greater.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setFormError("Stock must be 0 or greater.");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price,
      stock,
      category: form.category || "general"
    };
    if (form.imageUrl.trim()) payload.imageUrl = form.imageUrl.trim();
    if (form.compareAtPrice !== "" && !Number.isNaN(Number(form.compareAtPrice))) {
      const compareAt = Number(form.compareAtPrice);
      if (compareAt < 0) {
        setFormError("Compare-at price must be 0 or greater.");
        return;
      }
      if (price >= compareAt) {
        setFormError("Sale price must be less than compare-at price.");
        return;
      }
      payload.compareAtPrice = compareAt;
    }
    if (form.badge.trim()) payload.badge = form.badge.trim();
    try {
      await api.post("/products", payload);
      resetForm();
      loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to create product.");
    }
  };

  const startEdit = (product) => {
    setActivePage("edit");
    setEditingId(product._id);
    setFormError("");
    setForm({
      name: product.name || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      category: product.category || "general",
      compareAtPrice: product.compareAtPrice ?? "",
      badge: product.badge || "",
      imageUrl: product.imageUrl || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormError("");
    resetForm();
    setActivePage("list");
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setFormError("");
    const requiredError = validateRequiredFields();
    if (requiredError) {
      setFormError(requiredError);
      return;
    }
    const price = Number(form.price);
    const stock = Number(form.stock);
    if (!Number.isFinite(price) || price < 0) {
      setFormError("Sale price must be 0 or greater.");
      return;
    }
    if (!Number.isFinite(stock) || stock < 0) {
      setFormError("Stock must be 0 or greater.");
      return;
    }
    const payload = {
      name: form.name,
      description: form.description,
      price,
      stock,
      category: form.category || "general",
      imageUrl: form.imageUrl.trim()
    };
    if (form.compareAtPrice !== "" && !Number.isNaN(Number(form.compareAtPrice))) {
      const compareAt = Number(form.compareAtPrice);
      if (compareAt < 0) {
        setFormError("Compare-at price must be 0 or greater.");
        return;
      }
      if (price >= compareAt) {
        setFormError("Sale price must be less than compare-at price.");
        return;
      }
      payload.compareAtPrice = compareAt;
    } else {
      payload.compareAtPrice = null;
    }
    payload.badge = form.badge.trim();
    try {
      await api.put(`/products/${editingId}`, payload);
      cancelEdit();
      await loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to update product.");
    }
  };

  const deleteProduct = async (id) => {
    const ok = window.confirm("Delete this product?");
    if (!ok) return;
    try {
      await api.delete(`/products/${id}`);
      if (editingId === id) cancelEdit();
      await loadAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const onImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setFormError("Please choose an image file.");
      e.target.value = "";
      return;
    }
    const maxBytes = 2 * 1024 * 1024;
    if (file.size > maxBytes) {
      setFormError("Image must be smaller than 2MB.");
      e.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setFormError("");
      setForm((prev) => ({ ...prev, imageUrl: String(reader.result || "") }));
    };
    reader.onerror = () => setFormError("Could not read selected image.");
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <h1>Admin panel</h1>
        <div className="header-actions">
          <span className="muted">{user?.email}</span>
          <button type="button" className="btn-ghost" onClick={onLogout}>
            Log out
          </button>
        </div>
      </header>
      <main className="admin-main">
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Users</span>
              <span className="stat-value">{stats.userCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Products</span>
              <span className="stat-value">{stats.productCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Orders</span>
              <span className="stat-value">{stats.orderCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Revenue</span>
              <span className="stat-value">${stats.totalRevenue}</span>
            </div>
          </div>
        )}

        <div className="page-tabs">
          <button
            type="button"
            className={activePage === "add" ? "tab active" : "tab"}
            onClick={() => {
              setActivePage("add");
              setFormError("");
            }}
          >
            Add Product
          </button>
          <button
            type="button"
            className={activePage === "list" ? "tab active" : "tab"}
            onClick={() => {
              setActivePage("list");
              setFormError("");
            }}
          >
            Product List
          </button>
          {editingId ? (
            <button type="button" className={activePage === "edit" ? "tab active" : "tab"} onClick={() => setActivePage("edit")}>
              Edit Product
            </button>
          ) : null}
        </div>

        {activePage === "add" ? (
          <form className="product-form" onSubmit={createProduct}>
            <h2>Add product</h2>
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input
              placeholder="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="general">General</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home</option>
              <option value="accessories">Accessories</option>
            </select>
            <input
              placeholder="Sale price"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              placeholder="Compare-at price (optional)"
              type="number"
              min="0"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            />
            <label className="file-label">
              Product image
              <input type="file" accept="image/*" onChange={onImageFileChange} />
            </label>
            <input
              placeholder="Or paste image URL (optional)"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            {form.imageUrl ? <img className="preview-image" src={form.imageUrl} alt="Preview" /> : null}
            <input placeholder="Badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            <input
              placeholder="Stock"
              type="number"
              required
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            {formError ? <p className="error">{formError}</p> : null}
            <button type="submit">Create</button>
          </form>
        ) : null}

        {activePage === "list" ? (
          <section className="product-list">
            <h2>Catalog</h2>
            {formError ? <p className="error">{formError}</p> : null}
            <div className="card-grid">
              {products.map((p) => (
                <article key={p._id} className="product-card">
                  {p.imageUrl ? <img className="card-image" src={p.imageUrl} alt={p.name} /> : <div className="card-image placeholder" />}
                  <h3>{p.name}</h3>
                  <p className="muted">{p.description || "No description"}</p>
                  <p>
                    <strong>${p.price}</strong> {p.compareAtPrice ? <span className="muted"> / ${p.compareAtPrice}</span> : null}
                  </p>
                  <p className="muted">
                    Stock: {p.stock} | Category: {p.category}
                  </p>
                  <div className="card-actions">
                    <button type="button" className="btn-ghost" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="btn-danger" onClick={() => deleteProduct(p._id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {activePage === "edit" && editingId ? (
          <form className="product-form" onSubmit={updateProduct}>
            <h2>Edit product</h2>
            <input placeholder="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input
              placeholder="Description"
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <select required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="general">General</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home</option>
              <option value="accessories">Accessories</option>
            </select>
            <input
              placeholder="Sale price"
              type="number"
              required
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              placeholder="Compare-at price (optional)"
              type="number"
              min="0"
              value={form.compareAtPrice}
              onChange={(e) => setForm({ ...form, compareAtPrice: e.target.value })}
            />
            <label className="file-label">
              Product image
              <input type="file" accept="image/*" onChange={onImageFileChange} />
            </label>
            <input
              placeholder="Or paste image URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            {form.imageUrl ? <img className="preview-image" src={form.imageUrl} alt="Preview" /> : null}
            <input placeholder="Badge" value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })} />
            <input
              placeholder="Stock"
              type="number"
              required
              min="0"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
            />
            {formError ? <p className="error">{formError}</p> : null}
            <div className="inline-actions">
              <button type="submit">Save Changes</button>
              <button type="button" className="btn-ghost" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </form>
        ) : null}
      </main>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) return;
    api
      .get("/auth/me")
      .then(({ data }) => {
        if (data.user?.role === "admin") setUser(data.user);
        else {
          localStorage.removeItem("admin_token");
        }
      })
      .catch(() => localStorage.removeItem("admin_token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return (
    <>
      <style>{`
        .login-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .login-card { max-width: 400px; width: 100%; background: #fff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
        .login-card h1 { margin: 0 0 8px; font-size: 1.5rem; }
        .muted { color: #71717a; font-size: 14px; margin: 0 0 24px; }
        .login-card label { display: block; margin-bottom: 16px; font-size: 13px; font-weight: 600; }
        .login-card input { display: block; width: 100%; margin-top: 6px; padding: 10px 12px; border: 1px solid #d4d4d8; border-radius: 8px; font-size: 14px; }
        .login-card button { width: 100%; margin-top: 8px; padding: 12px; background: #18181b; color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        .login-card button:hover { background: #27272a; }
        .error { color: #b91c1c; font-size: 14px; margin-top: 8px; }
        .admin-shell { min-height: 100vh; }
        .admin-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 24px; background: #fff; border-bottom: 1px solid #e4e4e7; }
        .admin-header h1 { margin: 0; font-size: 1.25rem; }
        .header-actions { display: flex; align-items: center; gap: 16px; }
        .btn-ghost { background: transparent; border: 1px solid #d4d4d8; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
        .admin-main { max-width: 960px; margin: 0 auto; padding: 24px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .stat-card { background: #fff; padding: 16px; border-radius: 10px; border: 1px solid #e4e4e7; }
        .stat-label { display: block; font-size: 12px; color: #71717a; }
        .stat-value { font-size: 1.5rem; font-weight: 700; }
        .product-form { background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e4e4e7; margin-bottom: 32px; display: flex; flex-direction: column; gap: 12px; }
        .page-tabs { display: flex; gap: 10px; margin-bottom: 16px; }
        .tab { border: 1px solid #d4d4d8; background: #fff; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
        .tab.active { background: #18181b; color: #fff; border-color: #18181b; }
        .product-form h2 { margin: 0 0 8px; font-size: 1.1rem; }
        .product-form input, .product-form select { padding: 10px 12px; border: 1px solid #d4d4d8; border-radius: 8px; font-size: 14px; }
        .product-form .file-label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; color: #3f3f46; }
        .preview-image { width: 120px; height: 120px; object-fit: cover; border-radius: 8px; border: 1px solid #e4e4e7; }
        .product-form button { align-self: flex-start; padding: 10px 20px; background: #18181b; color: #fff; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
        .product-list { background: #fff; padding: 24px; border-radius: 10px; border: 1px solid #e4e4e7; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; }
        .product-card { border: 1px solid #e4e4e7; border-radius: 10px; padding: 12px; background: #fff; display: flex; flex-direction: column; gap: 8px; }
        .product-card h3 { margin: 0; font-size: 1rem; }
        .card-image { width: 100%; height: 140px; object-fit: cover; border-radius: 8px; border: 1px solid #e4e4e7; background: #fafafa; }
        .placeholder { background: linear-gradient(135deg, #f4f4f5, #e4e4e7); }
        .card-actions { display: flex; gap: 8px; margin-top: 4px; }
        .btn-danger { border: 1px solid #dc2626; background: #dc2626; color: #fff; padding: 8px 12px; border-radius: 8px; cursor: pointer; }
        .inline-actions { display: flex; gap: 10px; }
        .list-image { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; border: 1px solid #e4e4e7; }
      `}</style>
      {user ? <Dashboard user={user} onLogout={logout} /> : <LoginView onLoggedIn={setUser} />}
    </>
  );
}
