import {configureStore} from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import categoriesReducer from "./CategoriesSlice";
import cartReducer from "./CartSlice";
import authReducer from "./authSlice";
import userReducer from "./userSlice";




export const store = configureStore({
    reducer:{
        products: productsReducer,
        categories: categoriesReducer,
        cart:cartReducer,
        auth: authReducer,
        user: userReducer,
     }
})

