import {configureStore} from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import categoriesReducer from "./CategoriesSlice";

//en Reducer van todos los estados globales


export const store = configureStore({
    reducer:{
        products: productsReducer,
    categories: categoriesReducer,

     }
})

