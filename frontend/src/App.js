import React, { useEffect, useState } from "react";
import brownieImg from "./tasty-bite-images/brownie.png";
import cheeseburgerImg from "./tasty-bite-images/cheeseburger.png";
import cookieImg from "./tasty-bite-images/cookie.png";
import fountainDrinkImg from "./tasty-bite-images/fountain_drink.png";
import friesImg from "./tasty-bite-images/fries.png";
import hamburgerImg from "./tasty-bite-images/hamburger.png";
import icecreamImg from "./tasty-bite-images/icecream.png";
import milkshakeImg from "./tasty-bite-images/milkshake.png";
import sauceImg from "./tasty-bite-images/sauce.png";
import subImg from "./tasty-bite-images/sub.png";

const API = "";

const ITEM_IMAGES = {
  sku1:  hamburgerImg, // Hamburger
  sku2:  cheeseburgerImg, // Cheeseburger
  sku3:  milkshakeImg, // Milkshake
  sku4:  friesImg, // Fries
  sku5:  subImg, // Sub
  sku6:  icecreamImg, // Ice Cream
  sku7:  fountainDrinkImg, // Fountain Drink
  sku8:  cookieImg, // Cookie
  sku9:  brownieImg, // Brownie
  sku10: sauceImg, // Sauce
};

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
    windowFrame: {
      maxWidth: "860px",
      margin: "2rem auto",
      border: "2px solid #f4a7b9",
      borderRadius: "6px",
      overflow: "hidden",
      background: "#fff0f3",
    },
    titleBar: {
      background: "#fff0f3",
      borderBottom: "2px solid #f4a7b9",
      padding: "0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    titleText: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.85rem",
      color: "#e8789a",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    windowBtns: { display: "flex", gap: "0.4rem" },
    windowBtn: {
      width: "22px",
      height: "22px",
      border: "1.5px solid #f4a7b9",
      borderRadius: "2px",
      background: "#fff0f3",
      color: "#e8789a",
      fontSize: "0.6rem",
      cursor: "default",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
    },
    navBar: {
      background: "#ffd6e0",
      padding: "0.5rem 1rem",
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.5rem",
      borderBottom: "2px solid #f4a7b9",
    },
    navBtn: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      background: "#fff0f3",
      color: "#e8789a",
      border: "1.5px solid #f4a7b9",
      borderRadius: "2px",
      padding: "0.4rem 0.8rem",
      cursor: "pointer",
    },
    main: { padding: "1.5rem" },
    error: {
      background: "#ffe0e0",
      border: "1px solid #f4a7b9",
      borderRadius: "4px",
      padding: "0.75rem",
      marginBottom: "1rem",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      color: "#c0006a",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: "1rem",
    },
    card: {
      border: "2px solid #f4a7b9",
      borderRadius: "4px",
      overflow: "hidden",
      background: "#fff8fa",
      display: "flex",
      flexDirection: "column",
    },
    cardImageArea: {
      background: "#fff0f3",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3.5rem",
      height: "130px",
    },
    cardLabel: {
      background: "#ffd6e0",
      borderTop: "2px solid #f4a7b9",
      padding: "0.4rem 0.5rem",
      textAlign: "center",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.5rem",
      color: "#7eaacc",
      letterSpacing: "0.05em",
    },
    cardControls: {
      padding: "0.6rem 0.5rem",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      justifyContent: "center",
      background: "#fff8fa",
    },
    cardPrice: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.5rem",
      color: "#e8789a",
    },
    numInput: {
      width: "36px",
      padding: "0.25rem",
      border: "1.5px solid #f4a7b9",
      borderRadius: "2px",
      textAlign: "center",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.5rem",
      background: "#fff0f3",
      color: "#e8789a",
    },
    addBtn: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.45rem",
      background: "#f4a7b9",
      color: "#fff",
      border: "none",
      borderRadius: "2px",
      padding: "0.35rem 0.5rem",
      cursor: "pointer",
    },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: "1.5rem" },
    th: {
      textAlign: "left",
      borderBottom: "2px solid #f4a7b9",
      padding: "0.5rem",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.5rem",
      color: "#e8789a",
    },
    td: {
      padding: "0.6rem 0.5rem",
      borderBottom: "1px solid #ffd6e0",
      verticalAlign: "middle",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.5rem",
      color: "#555",
    },
    row: { display: "flex", gap: "0.4rem", alignItems: "center" },
    qtyBtn: {
      background: "#ffd6e0",
      border: "1.5px solid #f4a7b9",
      borderRadius: "2px",
      width: "24px",
      height: "24px",
      fontWeight: "bold",
      cursor: "pointer",
      color: "#e8789a",
    },
    removeBtn: {
      background: "none",
      border: "none",
      color: "#f4a7b9",
      fontWeight: "bold",
      fontSize: "1rem",
      cursor: "pointer",
    },
    totals: {
      textAlign: "right",
      lineHeight: "2.2",
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      color: "#888",
    },
    checkoutBtn: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      background: "#f4a7b9",
      color: "#fff",
      border: "none",
      borderRadius: "2px",
      padding: "0.75rem 1.5rem",
      marginTop: "1rem",
      cursor: "pointer",
    },
    confirmation: {
      textAlign: "center",
      padding: "3rem 1rem",
    },
    backBtn: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      background: "#f4a7b9",
      color: "#fff",
      border: "none",
      borderRadius: "2px",
      padding: "0.75rem 1.5rem",
      cursor: "pointer",
    },
    pageTitle: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.75rem",
      color: "#e8789a",
      marginBottom: "1.2rem",
    },
    emptyMsg: {
      fontFamily: "'Press Start 2P', monospace",
      fontSize: "0.55rem",
      color: "#aaa",
      lineHeight: "2",
    },
  };

  const WindowShell = ({ children, showNav = true }) => (
    <div style={st.windowFrame}>
      <div style={st.titleBar}>
        <span style={st.titleText}>🍓 Tasty Bite</span>
        <div style={st.windowBtns}>
          <div style={st.windowBtn}>—</div>
          <div style={st.windowBtn}>□</div>
          <div style={st.windowBtn}>✕</div>
        </div>
      </div>
      {showNav && (
        <div style={st.navBar}>
          <button style={st.navBtn} onClick={() => setView("menu")}>Menu</button>
          <button style={st.navBtn} onClick={() => { refreshCart(); setView("cart"); }}>
            Cart{cartCount > 0 ? ` (${cartCount})` : ""}
          </button>
        </div>
      )}
      <div style={st.main}>{children}</div>
    </div>
  );

  if (view === "confirmation") return (
    <WindowShell showNav={false}>
      <div style={st.confirmation}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎀</div>
        <div style={st.pageTitle}>Order received!</div>
        <p style={{ ...st.emptyMsg, marginBottom: "1rem" }}>
          Your order has been received. Thank you!
        </p>
        {order && (
          <p style={{ ...st.emptyMsg, marginBottom: "1.5rem" }}>
            Total paid: ${order.total.toFixed(2)}
          </p>
        )}
        <button style={st.backBtn} onClick={() => { setView("menu"); setOrder(null); }}>
          Order again ♡
        </button>
      </div>
    </WindowShell>
  );

  if (view === "cart") return (
    <WindowShell>
      <div style={st.pageTitle}>Your cart ♡</div>
      {cart.items.length === 0 ? (
        <p style={st.emptyMsg}>
          Your cart is empty!{" "}
          <button style={{ ...st.addBtn, marginLeft: "0.5rem" }} onClick={() => setView("menu")}>
            Browse menu
          </button>
        </p>
      ) : (
        <>
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
                  <td style={st.td}>
                    <span style={{ marginRight: "0.4rem" }}>{ITEM_IMAGES[item.sku]}</span>
                    {item.name}
                  </td>
                  <td style={st.td}>${item.price.toFixed(2)}</td>
                  <td style={st.td}>
                    <div style={st.row}>
                      <button style={st.qtyBtn} onClick={() => modifyQty(item.sku, item.quantity - 1)}>−</button>
                      <span style={{ minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                      <button style={st.qtyBtn} onClick={() => modifyQty(item.sku, item.quantity + 1)}>+</button>
                    </div>
                  </td>
                  <td style={st.td}>${item.line_total.toFixed(2)}</td>
                  <td style={st.td}>
                    <button style={st.removeBtn} onClick={() => removeItem(item.sku)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={st.totals}>
            <div>Subtotal: ${cart.subtotal.toFixed(2)}</div>
            <div>Tax (8%): ${cart.tax.toFixed(2)}</div>
            <div style={{ color: "#e8789a" }}>Total: ${cart.total.toFixed(2)}</div>
            <div>
              <button style={st.checkoutBtn} onClick={placeOrder}>Place order 🍓</button>
            </div>
          </div>
        </>
      )}
    </WindowShell>
  );

  return (
    <WindowShell>
      <div style={st.pageTitle}>Ready to order? </div>
      {error && <div style={st.error}>{error}</div>}
      <div style={st.grid}>
        {menu.map((item) => (
          <div key={item.sku} style={st.card}>
          <div style={st.cardImageArea}>
            <img
              src={ITEM_IMAGES[item.sku]}
              alt={item.name}
              style={{
                width: "200%",
                height: "200%",
                objectFit: "contain",
                imageRendering: "pixelated",
                background: "#fff0f3"
              }}
            />
          </div>

            <div style={st.cardLabel}>{item.name.toUpperCase()}</div>

            <div style={st.cardControls}>
              <span style={st.cardPrice}>${item.price.toFixed(2)}</span>
              <input
                type="number"
                min={1}
                value={quantities[item.sku] || 1}
                onChange={(e) =>
                  setQuantities({ ...quantities, [item.sku]: Math.max(1, parseInt(e.target.value) || 1) })
                }
                style={st.numInput}
              />
              <button style={st.addBtn} onClick={() => addToCart(item.sku)}>
                + add
              </button>
            </div>

          </div>
        ))}
      </div>
    </WindowShell>
  );
}