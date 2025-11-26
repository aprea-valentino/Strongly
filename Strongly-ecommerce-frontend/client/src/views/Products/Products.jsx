import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/productsSlice.js";
import { fetchCategories } from "../../redux/CategoriesSlice.js";
import { useSearchParams } from 'react-router-dom';

export default function Products() {
  const dispatch = useDispatch();
   const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('q');

  // productos
  const productsState = useSelector((state) => state.products);
  const items = productsState?.items ?? [];
  const loading = productsState?.loading ?? false;
  const error = productsState?.error ?? null;

  // categorías
  const categories = useSelector((state) => state.categories.items ?? []);

  // filtros seleccionados
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  // cargar datos
  useEffect(() => {
    dispatch(fetchProducts(searchQuery));
    dispatch(fetchCategories());
  }, [dispatch, searchQuery]);

  // cuando se selecciona/deselecciona una categoría
  const handleCategorySelect = (categoryId, checked) => {
    setSelectedCategories((prev) =>
      checked
        ? [...prev, categoryId] // agregar
        : prev.filter((id) => id !== categoryId) // sacar
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const filtered = items.filter((p) => {

    if ((p.stock ?? 0) <= 0) return false;

    // si no seleccionó categorías -> mostrar todo
    if (selectedCategories.length === 0) return true;

    // producto pertenece a una categoría seleccionada
    return selectedCategories.includes(p.categoryid);
  });

  // ordenar si eligió asc o desc

  const finalProducts = [...filtered];
  if (sortOrder === "asc") finalProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") finalProducts.sort((a, b) => b.price - a.price);
console.log(finalProducts)
  return (
    <div className="products-page-container">
      <Sidebar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
      />

      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {loading && <p>Cargando publicaciones... </p>}
        {error && <p style={{ color: "red" }}>Error al cargar: {error}</p>}

        {!loading && !error && <ListCards productos={finalProducts} />}
      </div>
    </div>
  );
}


/*import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, fetchProductsbyCategorie } from "../../redux/productsSlice.js";
import { fetchCategories } from "../../redux/CategoriesSlice.js";

export default function Products() {
  const dispatch = useDispatch();

  const productsState = useSelector((state) => state.products);
  const items = productsState?.items ?? [];
  const loading = productsState?.loading ?? false;
  const error = productsState?.error ?? null;

  const categories = useSelector((state) => state.categories.items ?? []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [mergedProducts, setMergedProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const fetchMultiCategories = async (categoryIds) => {
    const allResults = [];

    for (const id of categoryIds) {
      const result = await dispatch(fetchProductsbyCategorie(id)).unwrap();
      allResults.push(...result);
    }

    // eliminar duplicados por ID
    const unique = Array.from(
      new Map(allResults.map((p) => [p.id, p])).values()
    );

    setMergedProducts(unique);
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      dispatch(fetchProducts()).then((resp) => {
        setMergedProducts(resp.payload);
      });
    } else {
      fetchMultiCategories(selectedCategories);
    }
  }, [selectedCategories, dispatch]);

  const handleCategorySelect = (categoryId, checked) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  // Ordenamiento del front
  const finalProducts = [...mergedProducts];

  if (sortOrder === "asc") finalProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") finalProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="products-page-container">
      <Sidebar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
      />

      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {loading && <p>Cargando publicaciones... </p>}
        {error && <p style={{ color: "red" }}>Error al cargar: {error}</p>}

        {!loading && !error && <ListCards productos={finalProducts} />}
      </div>
    </div>
  );
}
*/

/*import React, { useEffect, useState } from "react";
import ListCards from "../../components/ListCards/ListCards.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts,fetchProductsbyCategorie } from "../../redux/productsSlice.js";
import { fetchCategories } from "../../redux/CategoriesSlice.js";

export default function Products() {
  const dispatch = useDispatch();

  // productos
  const productsState = useSelector((state) => state.products);
  const items = productsState?.items ?? [];
  const loading = productsState?.loading ?? false;
  const error = productsState?.error ?? null;

  // categorías
  const categories = useSelector((state) => state.categories.items ?? []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategorySelect = (categoryId, checked) => {
    setSelectedCategories((prev) =>
      checked ? [...prev, categoryId] : prev.filter((id) => id !== categoryId)
    );
  };

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  const filtered = items.filter((p) => {
    if ((p.stock ?? 0) <= 0) return false;
    if (selectedCategories.length === 0) return true;
    return (
      selectedCategories.includes(p.categoryId) ||
      selectedCategories.includes(p.category)
    );
  });

  const finalProducts = [...filtered];
  if (sortOrder === "asc") finalProducts.sort((a, b) => a.price - b.price);
  if (sortOrder === "desc") finalProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="products-page-container">
      <Sidebar
        categories={categories}
        onCategorySelect={handleCategorySelect}
        onSortChange={handleSortChange}
      />

      <div className="products-main-content">
        <h2>Productos disponibles</h2>

        {loading && <p>Cargando publicaciones... </p>}
        {error && <p style={{ color: "red" }}>Error al cargar: {error}</p>}

        {!loading && !error && <ListCards productos={finalProducts} />}
      </div>
    </div>
  );
}
*/