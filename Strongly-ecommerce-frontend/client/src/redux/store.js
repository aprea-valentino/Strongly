import {configureStore} from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import categoriesReducer from "./CategoriesSlice";
import cartReducer from "./CartSlice";

//en Reducer van todos los estados globales


export const store = configureStore({
    reducer:{
        products: productsReducer,
        categories: categoriesReducer,
        cart:cartReducer,
     }
})

