import "./FCard.css";

export default function FeaturedCard({ nombre, descripcion, precio }) {
  return (
    <div className="FCard">
      <h3 className="FCard-title">{nombre}</h3>
      <p className="FCard-description">{descripcion}</p>
      <p className="FCard-price">{precio}</p>
    </div>
  );
}
