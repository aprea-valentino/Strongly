import "./Card.css";

export default function Card({ nombre, descripcion, precio }) {
  return (
    <div className="card">
      <h3 className="card-title">{nombre}</h3>
      <p className="card-description">{descripcion}</p>
      <p className="card-price">{precio}</p>
    </div>
  );
}
