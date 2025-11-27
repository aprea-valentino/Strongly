import "./FCard.css";

export default function FeaturedCard({ nombre, descripcion, precioOriginal, precioConDescuento, imagen }) {
   const imageSrc = imagen ? `data:image/jpeg;base64,${imagen}` : null;

   const tieneDescuento = precioConDescuento && precioConDescuento < precioOriginal;

  return (
    <div className="FCard border rounded-lg shadow p-4 bg-white">
      {imageSrc && (
        <img
          src={imageSrc}
          alt={nombre}
          className="FCard-img rounded-md mb-3"
          style={{ 
            width: "100%", 
            maxWidth: "400px",
            height: "250px", 
            objectFit: "cover",
            borderRadius: "12px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            border: "3px solid rgba(255,255,255,0.3)"
          }}
        />
      )}

      <h3 className="FCard-title font-semibold text-lg mb-2">{nombre}</h3>
      <p className="FCard-description text-gray-600 mb-3">{descripcion}</p>

      <div className="FCard-price text-xl font-bold">
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
