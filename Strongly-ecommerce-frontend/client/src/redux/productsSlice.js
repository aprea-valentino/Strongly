import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsService } from '../services/productsService';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',

    async (searchQuery) => {
  const data = await productsService.getAllProducts(searchQuery);
  return data; // Esto se convierte en action.payload si tiene éxito (fulfilled)
      }
);
export const fetchProductsbyCategorie = createAsyncThunk(
  'products/category',
  async (idCategory) => {
    const data = await productsService.getProductsByCategory(idCategory);
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "/products",
  async ({ productData, imageFiles }, { rejectWithValue }) => {
    try {

      const data = await productsService.createProduct(productData,imageFiles);
      return data;
    } catch (err) {
      return rejectWithValue(err.message || "Error al crear producto");
    }
  }
);
/*
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async (updatedProduct) => {
    const { id, precio} = updatedProduct;
    const newPrice = precio;
    const data = await productsService.updatePrice(id, newPrice);
    return data;
  }
);*/

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const updated = await productsService.updatePriceStock( parseInt(id),
       productData.price,
        productData.stock,
         productData.name,
          productData.id_category,
           productData.descuento );
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "Error al actualizar producto");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await productsService.deleteProduct(productId);
      return productId;
    } catch (err) {
      return rejectWithValue(err.message || "Error al eliminar producto");
    }
  }
);

export const updateDiscount = createAsyncThunk(
  "products/updateDiscount",
  async ({ productId, discount }, { rejectWithValue }) => {
    try {
      const updated = await productsService.updateDiscount(productId, discount);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || "Error al actualizar descuento");
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const product = await productsService.getProductById(productId);
      return product;
    } catch (err) {
      return rejectWithValue(err.message || "Error al obtener producto");
    }
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
      })
       .addCase(fetchProductsbyCategorie.pending, (state) => {
            state.loading= true,
            state.error= null
        })
        .addCase(fetchProductsbyCategorie.fulfilled, (state, action) => {
            state.loading= false,
            state.items=action.payload //esto se guarda en el estado global de items
        })
        .addCase(fetchProductsbyCategorie.rejected, (state, action) => {
            state.loading= false,
            state.error=action.error.message
        })
      // DELETE PRODUCT
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // UPDATE DISCOUNT
      .addCase(updateDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      // FETCH PRODUCT BY ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.productosId = action.payload;
        // También actualizar en items si ya existe
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
      
}});

export default productsSlice.reducer