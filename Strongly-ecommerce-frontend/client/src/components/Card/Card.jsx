import "./Card.css";

export default function Card({ nombre, descripcion, precio,imagen }) {
 const imageSrc = imagen ? `data:image/jpeg;base64,${imagen}` : null;

  return (
    <div className="card">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={nombre}
          className="card-img"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      )}

      <h3 className="card-title">{nombre}</h3>
      <p className="card-price">${precio}</p>
    </div>
  );
}
