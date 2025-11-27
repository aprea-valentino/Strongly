import "./ListCards.css";
import Card from "../Card/Card";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "/api/v1";

export default function ListCards({ productos }) {
  return (
    <div className="list-cards">
      {productos.map((prod) => {
        const firstImageId = (prod.imageIds && prod.imageIds.length > 0) ? prod.imageIds[0] : null;
     
                  return (
          <Link
            key={prod.id}
            to={`/product/${prod.id}`}
            className="card-link"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              nombre={prod.name}
              descripcion={prod.description}
              precioOriginal={prod.price}
              precioConDescuento={ prod.descuento && prod.descuento > 0
      ? prod.price - (prod.price * prod.descuento) / 100
      : prod.price}
              imagen={prod.image}
              descuento={prod.descuento || 0}
            />
          </Link>
        );
      })}
    </div>
  );
}
