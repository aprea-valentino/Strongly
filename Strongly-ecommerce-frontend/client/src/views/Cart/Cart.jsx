import React, { useEffect, useState } from "react";
import {
  getCart,
  removeItemFromCart,
  updateCartItem,
  clearCart,
  checkout,
} from "../../services/cartService";
import "./Cart.css";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
const loadCart = async () => {
  setLoading(true);
  setError(null); // limpiar error previo

  try {
    const data = await getCart();
    setCart(data);
  } catch (err) {
    console.error(err); // útil para debugging
    // Mostrar mensaje amigable + mensaje real si existe
    setError(
      err instanceof Error
        ? `Error al obtener el carrito. ${err.message}`
        : "Error desconocido al obtener el carrito."
    );
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (productId) => {
    await removeItemFromCart(productId);
    loadCart();
  };

  const handleQuantityChange = async (productId, qty) => {
    await updateCartItem(productId, qty);
    loadCart();
  };

  const handleClear = async () => {
    await clearCart();
    loadCart();
  };

  const handleCheckout = async () => {
    const response = await checkout();
    alert("Compra realizada con éxito ✅");
    console.log(response);
    loadCart();
  };

  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cart-container">
      <h2>🛒 Tu carrito</h2>

      {(!cart || cart.items.length === 0) ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <li key={item.productId} className="cart-item">
                <span>{item.name}</span>
                <span>${item.unitPrice}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.productId, parseInt(e.target.value))
                  }
                />
                <button onClick={() => handleRemove(item.productId)}>❌</button>
              </li>
            ))}
          </ul>

          <h3>Total: ${cart.total}</h3>

          <div className="cart-actions">
            <button onClick={handleClear}>Vaciar carrito</button>
            <button onClick={handleCheckout}>Finalizar compra</button>
          </div>
        </>
      )}
    </div>
  );
}
