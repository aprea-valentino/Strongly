import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '../services/productsService';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',

    async () => {
      const {data} = await productsService.getAllProducts();
      return data; // Esto se convierte en action.payload si tiene éxito (fulfilled)
    
  }
);

const productsSlice = createSlice({
    name: 'products',
    initialState:{
        items: [],
        loading: false,
        error: null,
        productosId:{},
        productosFilter:[]
    },
    reducers:{}, //solo se usa en caso de lógica síncrona
    extraReducers:(builder)=>{
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.loading= true,
            state.error= null
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading= false,
            state.items=action.payload //esto se guarda en el estado global de items
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading= false,
            state.error=action.error.message
        })
}});

export default productsSlice.reducer