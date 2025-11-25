import { useState } from "react";
import { useDispatch } from "react-redux";
import { clearUserCart,cartCheckout } from "../../redux/CartSlice";
import "./Pago.css";

export default function Pago({ onClose, items, total }) {
  const dispatch = useDispatch();

  const [province, setProvince] = useState("");
  const [street, setStreet] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCVV, setCardCVV] = useState("");

  const handleBuy = () => {
    if (!province || !street || !postalCode || !cardNumber || !cardName || !cardExp || !cardCVV) {
      alert("Completa todos los datos antes de continuar");
      return;
    }
    dispatch(cartCheckout());

    alert("Compra realizada con éxito");

    onClose();
  };

  const handleCancel = () => {
    dispatch(clearUserCart());
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Confirmar compra</h2>

        <h3>Productos:</h3>
        <ul className="pm-list">
          {items.map((item) => (
            <li key={item.productId}>
              {item.name} x{item.quantity} — ${item.unitPrice * item.quantity}
            </li>
          ))}
        </ul>

        <h3>Total: ${total}</h3>

        <div className="form-group">
          <label>Provincia</label>
          <input
            type="text"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            placeholder="Ej: Buenos Aires"
          />
        </div>

        <div className="form-group">
          <label>Calle</label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="Ej: ruta 23"
          />
        </div>

        <div className="form-group">
          <label>Código postal</label>
          <input
            type="text"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder="Ej: 1870"
          />
        </div>

        <h3>Tarjeta de crédito</h3>

        <div className="form-group">
          <label>Número de tarjeta</label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            placeholder="1234 5678 9999 0000"
          />
        </div>

        <div className="form-group">
          <label>Nombre en la tarjeta</label>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Pepe Lopez"
          />
        </div>

        <div className="pm-row">
          <div className="form-group half">
            <label>Vencimiento</label>
            <input
              type="text"
              value={cardExp}
              onChange={(e) => setCardExp(e.target.value)}
              placeholder="MM/AA"
            />
          </div>

          <div className="form-group half">
            <label>CVV</label>
            <input
              type="text"
              value={cardCVV}
              onChange={(e) => setCardCVV(e.target.value)}
              placeholder="123"
            />
          </div>
        </div>

        <div className="actions">
          <button onClick={handleCancel} className="btn-cancel">
            Cancelar
          </button>
          <button onClick={handleBuy} className="btn-primary">
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
}
