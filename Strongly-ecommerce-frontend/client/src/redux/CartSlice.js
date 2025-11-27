import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as cartService from "../services/cartService";

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async () => {
    const data = await cartService.getCart();
    return data;
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }) => {
    const data = await cartService.addItemToCart(productId, quantity);
    return data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }) => {
    const data = await cartService.updateCartItem(productId, quantity);
    return data;
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId) => {
    await cartService.removeItemFromCart(productId);
    return productId; // devolvemos el id para borrarlo localmente
  }
);

export const clearUserCart = createAsyncThunk(
  "cart/clearUserCart",
  async () => {
    await cartService.clearCart();
    return true;
  }
);

export const cartCheckout = createAsyncThunk(
  "cart/cartCheckout",
  async () => {
    const data = await cartService.checkout();
    return data;
  }
);


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],       
    total: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

    
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })




      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })





      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })





      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        const productId = action.payload;
        state.items = state.items.filter((i) => i.productId !== productId);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })





      .addCase(clearUserCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearUserCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(clearUserCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })




      
      .addCase(cartCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cartCheckout.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.total = 0;
      })
      .addCase(cartCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
