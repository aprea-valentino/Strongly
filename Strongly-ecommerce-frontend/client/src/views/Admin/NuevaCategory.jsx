import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories,createCategory } from "../../redux/CategoriesSlice";
import './NuevaCategory.css';
const NuevaCategory = ({ onClose }) => {
  const dispatch = useDispatch();

  const { items: categories, loading } = useSelector(
    (state) => state.categories
  );

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState(null);


  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    await dispatch(
      createCategory({
        name,
        description,
        parent_id: parentId ? parseInt(parentId) : null,
      })
    );

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Nueva Categoría</h2>

   

        <div className="form-group">
          <label htmlFor="title">Nombre:</label>

          <input
            type="text"
             id="title" 
             name="title" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre de la categoría"
          />
        </div>

        <div className="form-group">
          <label>Descripción (opcional)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Parent</label>

          {loading ? (
            <p>Cargando categorías...</p>
          ) : (
            <select
              value={parentId || ""}
              onChange={(e) => setParentId(e.target.value)}
            >
              <option value="">Sin parent</option>

              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="actions">
          <button onClick={onClose} className="btn-cancel">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="btn-primary">
            Crear
          </button>
        </div>

      </div>
    </div>
  );
};

export default NuevaCategory;
