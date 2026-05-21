import React, { useEffect, useState } from "react";

const API = "";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState({ items: [], subtotal: 0, tax: 0, total: 0 });
  const [quantities, setQuantities] = useState({});
  const [view, setView] = useState("menu");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/menu`)
      .then((r) => r.json())
      .then(setMenu)
      .catch(() => setError("Could not connect to server. Is the backend running?"));
  }, []);

  const refreshCart = () =>
    fetch(`${API}/api/cart`).then((r) => r.json()).then(setCart);

  const addToCart = (sku) => {
    const qty = quantities[sku] || 1;
    setError("");
    fetch(`${API}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, quantity: qty }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setCart(data);
      });
  };

  const modifyQty = (sku, qty) => {
    fetch(`${API}/api/cart/modify`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, quantity: qty }),
    })
      .then((r) => r.json())
      .then((data) => { if (!data.error) setCart(data); });
  };

  const removeItem = (sku) => {
    fetch(`${API}/api/cart/${sku}`, { method: "DELETE" })
      .then((r) => r.json())
      .then((data) => { if (!data.error) setCart(data); });
  };

  const placeOrder = () => {
    fetch(`${API}/api/checkout`, { method: "POST" })
      .then((r) => r.json())
      .then((data) => {
        setOrder(data.order);
        setCart({ items: [], subtotal: 0, tax: 0, total: 0 });
        setView("confirmation");
      });
  };

  const cartCount = cart.items.reduce((sum, i) => sum + i.quantity, 0);

  const st = {
    header: { background: "#c0392b", color: "#fff", padding: "1rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" },
    h1: { fontSize: "1.4rem", fontWeight: "bold" },
    navBtn: { background: "rgba(255,255,255,0.2)", color: "#fff", border: "none", borderRadius: "6px", padding: "0.4rem 1rem", fontWeight: "bold", marginLeft: "0.5rem", cursor: "pointer" },
    main: { maxWidth: "800px", margin: "2rem auto", padding: "0 1rem" },
    error: { background: "#fdd", border: "1px solid #c00", borderRadius: "6px", padding: "0.75rem", marginBottom: "1rem" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" },
    card: { background: "#fff", border: "1px solid #ddd", borderRadius: "8px", padding: "1rem" },
    cardName: { fontWeight: "bold", fontSize: "1rem", marginBottom: "0.25rem" },
    cardPrice: { color: "#c0392b", fontWeight: "bold", marginBottom: "0.75rem" },
    row: { display: "flex", gap: "0.5rem", alignItems: "center" },
    numInput: { width: "52px", padding: "0.3rem", border: "1px solid #ccc", borderRadius: "4px", textAlign: "center" },
    addBtn: { background: "#c0392b", color: "#fff", border: "none", borderRadius: "4px", padding: "0.35rem 0.75rem", fontWeight: "bold", cursor: "pointer" },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" },
    th: { textAlign: "left", borderBottom: "2px solid #ddd", padding: "0.5rem" },
    td: { padding: "0.6rem 0.5rem", borderBottom: "1px solid #eee", verticalAlign: "middle" },
    qtyBtn: { background: "#eee", border: "none", borderRadius: "4px", width: "28px", height: "28px", fontWeight: "bold", cursor: "pointer" },
    removeBtn: { background: "none", border: "none", color: "#c00", fontWeight: "bold", fontSize: "1.1rem", cursor: "pointer" },
    totals: { textAlign: "right", lineHeight: "2" },
    checkoutBtn: { background: "#27ae60", color: "#fff", border: "none", borderRadius: "6px", padding: "0.75rem 2rem", fontWeight: "bold", fontSize: "1rem", marginTop: "1rem", cursor: "pointer" },
    confirmation: { textAlign: "center", padding: "3rem 1rem" },
    backBtn: { background: "#c0392b", color: "#fff", border: "none", borderRadius: "6px", padding: "0.75rem 2rem", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" },
  };

  if (view === "confirmation") return (
    <div>
      <header style={st.header}><span style={st.h1}>Tasty Bite</span></header>
      <main style={st.main}>
        <div style={st.confirmation}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Order Received!</h2>
          <p style={{ color: "#555", marginBottom: "1rem" }}>Your order has been received. Thank you!</p>
          {order && <p style={{ marginBottom: "1.5rem" }}><strong>Total paid: ${order.total.toFixed(2)}</strong></p>}
          <button style={st.backBtn} onClick={() => { setView("menu"); setOrder(null); }}>Order Again</button>
        </div>
      </main>
    </div>
  );

  if (view === "cart") return (
    <div>
      <header style={st.header}>
        <span style={st.h1}>Tasty Bite</span>
        <div>
          <button style={st.navBtn} onClick={() => setView("menu")}>Menu</button>
          <button style={st.navBtn} onClick={() => { refreshCart(); setView("cart"); }}>Cart {cartCount > 0 && `(${cartCount})`}</button>
        </div>
      </header>
      <main style={st.main}>
        <h2 style={{ marginBottom: "1rem" }}>Your Cart</h2>
        {cart.items.length === 0
          ? <p style={{ color: "#777" }}>Your cart is empty. <button style={{ ...st.addBtn, marginLeft: "0.5rem" }} onClick={() => setView("menu")}>Browse Menu</button></p>
          : <>
              <table style={st.table}>
                <thead>
                  <tr>
                    <th style={st.th}>Item</th>
                    <th style={st.th}>Price</th>
                    <th style={st.th}>Qty</th>
                    <th style={st.th}>Total</th>
                    <th style={st.th}></th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.sku}>
                      <td style={st.td}>{item.name}</td>
                      <td style={st.td}>${item.price.toFixed(2)}</td>
                      <td style={st.td}>
                        <div style={st.row}>
                          <button style={st.qtyBtn} onClick={() => modifyQty(item.sku, item.quantity - 1)}>−</button>
                          <span style={{ minWidth: "24px", textAlign: "center" }}>{item.quantity}</span>
                          <button style={st.qtyBtn} onClick={() => modifyQty(item.sku, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td style={st.td}>${item.line_total.toFixed(2)}</td>
                      <td style={st.td}><button style={st.removeBtn} onClick={() => removeItem(item.sku)}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={st.totals}>
                <div>Subtotal: <strong>${cart.subtotal.toFixed(2)}</strong></div>
                <div>Tax (8%): <strong>${cart.tax.toFixed(2)}</strong></div>
                <div style={{ fontSize: "1.1rem" }}>Total: <strong>${cart.total.toFixed(2)}</strong></div>
                <button style={st.checkoutBtn} onClick={placeOrder}>Place Order</button>
              </div>
            </>
        }
      </main>
    </div>
  );

  return (
    <div>
      <header style={st.header}>
        <span style={st.h1}>Tasty Bite</span>
        <div>
          <button style={st.navBtn} onClick={() => setView("menu")}>Menu</button>
          <button style={st.navBtn} onClick={() => { refreshCart(); setView("cart"); }}>Cart {cartCount > 0 && `(${cartCount})`}</button>
        </div>
      </header>
      <main style={st.main}>
        <h2 style={{ marginBottom: "1rem" }}>Menu</h2>
        {error && <div style={st.error}>{error}</div>}
        <div style={st.grid}>
          {menu.map((item) => (
            <div key={item.sku} style={st.card}>
              <div style={st.cardName}>{item.name}</div>
              <div style={st.cardPrice}>${item.price.toFixed(2)}</div>
              <div style={st.row}>
                <input
                  type="number" min={1}
                  value={quantities[item.sku] || 1}
                  onChange={(e) => setQuantities({ ...quantities, [item.sku]: Math.max(1, parseInt(e.target.value) || 1) })}
                  style={st.numInput}
                />
                <button style={st.addBtn} onClick={() => addToCart(item.sku)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
