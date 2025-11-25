
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
    <div className="cart-container">
      <h2>🛒 Tu carrito</h2>

      {(!items || items.length === 0) ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="cart-items">
            {items.map((item) => (
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

          <h3>Total: ${total}</h3>

          <div className="cart-actions">
            <button onClick={handleClear}>Vaciar carrito</button>
            <button onClick={handleCheckout}>Finalizar compra</button>
            {showPayment && (  <Pago
    onClose={() => setShowPayment(false)}
    items={items}
    total={total}
  />
)}
          </div>
        </>
      )}
    </div>
  );
}
