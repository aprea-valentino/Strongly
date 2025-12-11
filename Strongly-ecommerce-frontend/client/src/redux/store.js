import {configureStore} from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import categoriesReducer from "./CategoriesSlice";
import cartReducer from "./CartSlice";
import authReducer from "./authSlice";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';





const authPersistConfig = {
    key: 'auth',
    storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
        reducer:{
                products: productsReducer,
                categories: categoriesReducer,
                cart:cartReducer,
                auth: persistedAuthReducer,
         }
});

export const persistor = persistStore(store);

