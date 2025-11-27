
import React, { useEffect,useState  } from "react";
import { useSelector, useDispatch } from "react-redux";
import Pago from '../Pagos/Pago';

import {
  fetchCart,
  removeCartItem,
  updateCartItem,
  clearUserCart,
  cartCheckout,
} from "../../redux/CartSlice";

import "./Cart.css";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, total, loading, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (productId) => {
    dispatch(removeCartItem(productId));
  };

  const handleQuantityChange = (productId, qty) => {
    dispatch(updateCartItem({ productId, quantity: qty }));
  };

  const handleClear = () => {
    dispatch(clearUserCart());
  };

 /* const handleCheckout = () => {
    dispatch(cartCheckout());
  };*/
const [showPayment, setShowPayment] = useState(false);

const handleCheckout = () => {
  setShowPayment(true);
};
  if (loading) return <p>Cargando carrito...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="cart-page-container">
      <h1>🛒 Tu carrito</h1>

      {(!items || items.length === 0) ? (
        <div className="empty-cart">
          <p className="empty-message">Tu carrito está vacío</p>
          <a href="/products" className="continue-shopping-btn">Ir a comprar</a>
        </div>
      ) : (
        <div className="cart-content-wrapper">
          <div className="cart-items-section">
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item.productId} className="cart-item">
                  <div className="item-details">
                    <div className="item-image-placeholder"></div>
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-price-unit">Precio unitario: ${Number(item.unitPrice).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="item-quantity-control">
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="qty-input"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0) {
                          handleQuantityChange(item.productId, val);
                        }
                      }}
                    />
                    <button 
                      className="qty-btn"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    <span className="subtotal-label">Subtotal:</span>
                    <span className="subtotal-price">${Number(item.subtotal).toFixed(2)}</span>
                  </div>

                  <button 
                    className="remove-item-btn" 
                    onClick={() => handleRemove(item.productId)}
                    title="Eliminar producto"
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>

            <button className="clear-cart-btn" onClick={handleClear}>
              Vaciar carrito
            </button>
          </div>

          <div className="cart-summary">
            <h2>Resumen de compra</h2>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Envío:</span>
              <span className="free-shipping">Gratis</span>
            </div>
            <hr />
            <div className="summary-line total-line">
              <span>Total:</span>
              <span>${Number(total).toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Finalizar compra
            </button>
            {showPayment && (
              <Pago
                onClose={() => setShowPayment(false)}
                items={items}
                total={total}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
