import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '../services/productsService';

const URL = 'http://localhost:3001/products'; //VERIFICAR URL

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',

    async () => {
      const {data} = await productsService.getAllProducts();
      return data; // Esto se convierte en action.payload si tiene éxito (fulfilled)
      }
);

export const createProduct = createAsyncThunk(
  "/products",
  async (newProduct) => {
    const { data } = await productsService.createProduct(newProduct);
    return data;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct) => {
    const { id, precio} = updatedProduct;
    const newPrice = precio;
    const data = await productsService.updatePrice(id, newPrice);
    return data;
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
        .addCase(createProduct.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload];
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (post) => post.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
}});

export default productsSlice.reducer