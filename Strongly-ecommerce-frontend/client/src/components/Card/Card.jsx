import "./Card.css";

export default function Card({ nombre, descripcion, precioOriginal, precioConDescuento, imagen }) {
  const imageSrc = imagen ? `data:image/jpeg;base64,${imagen}` : null;

  const tieneDescuento = precioConDescuento && precioConDescuento < precioOriginal;

  return (
    <div className="card border rounded-lg shadow p-4 bg-white">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={nombre}
          className="card-img rounded-md mb-3"
          style={{ width: "100%", height: "200px", objectFit: "cover" }}
        />
      )}

      <h3 className="card-title font-semibold text-lg mb-2">{nombre}</h3>
      <p className="card-description text-gray-600 mb-3">{descripcion}</p>

      <div className="card-price text-xl font-bold">
        {tieneDescuento ? (
          <>
            <span className="text-gray-400 line-through mr-2">${precioOriginal}</span>
            <span className="text-red-500">${precioConDescuento}</span>
          </>
        ) : (
          <span>${precioOriginal}</span>
        )}
      </div>
    </div>
  );
}
