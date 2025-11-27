import Home from "./views/Home";
import MainLayout from "./views/Layout/MainLayout";
import Offers from "./views/Offers"; 
import Products from "./views/Products/Products.jsx";
import Register from "./views/Register/Register.jsx";
import ProductDetail from "./views/Products/ProductDetail";
import AdminPage from "./views/Admin/AdminPage.jsx";
import AdminRoute from "./views/Admin/AdminRoute.jsx"; 
import manage from "./views/Admin/manage.jsx";
import Cart from "./views/Cart/Cart.jsx";
import AddProduct from "./views/Admin/AddProduct.jsx";
import PaginaDescuentos from "./views/Admin/PaginaDescuentos.jsx";
import AddCategorie from "./views/Admin/NuevaCategory.jsx";
import AddDiscount from "./views/Admin/AddDiscount.jsx";
import "./App.css";
import { Routes, Route,  } from "react-router-dom";


export default function App() {

  return (

 <Routes>


      <Route path="/register" element={<Register />} /> 


      <Route element={<MainLayout />}>
        

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart/>} />
        

        <Route path="/admin" element={<AdminRoute element={AdminPage} />} />
                <Route path="/admin/addCategorie"element={<AdminRoute element={AddCategorie} />}/>

        <Route path="/admin/add"element={<AdminRoute element={AddProduct} />}/>
        <Route path="/admin/manage"element={<AdminRoute element={manage} />}/>
         <Route path="/admin/sale"element={<AdminRoute element={PaginaDescuentos} />}/>
        <Route path="/admin/discount"element={<AdminRoute element={AddDiscount} />}/>
        
        
        
        
      </Route> 

    </Routes>   
        
  );
}