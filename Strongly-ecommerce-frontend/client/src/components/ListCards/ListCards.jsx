import "./ListCards.css";
import Card from "../Card/Card";
import { Link } from "react-router-dom";

export default function ListCards({ productos }) {
  return (
    <div className="list-cards">
      {productos.map((prod) => (
        <Link
          key={prod.id}
          to={`/product/${prod.id}`}
          className="card-link"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card
            nombre={prod.name}
            descripcion={prod.description}
            precio={prod.price}
          />
        </Link>
      ))}
    </div>
  );
}
