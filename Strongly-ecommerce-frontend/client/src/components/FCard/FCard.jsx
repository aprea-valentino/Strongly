import "./FCard.css";

export default function FeaturedCard({ nombre, descripcion, precio,imagen }) {
   const imageSrc = imagen ? `data:image/jpeg;base64,${imagen}` : null;

  return (
    <div className="FCard">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={nombre}
          className="card-img"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      )}
      <h3 className="FCard-title">{nombre}</h3>
      <p className="FCard-price">{precio}</p>
    </div>
  );
}
