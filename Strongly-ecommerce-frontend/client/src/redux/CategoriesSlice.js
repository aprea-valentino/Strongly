import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoryService } from "../services/categoryService";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const data = await categoryService.getAllCategories();
    return data;
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id) => {
    const data = await categoryService.getCategoryById(id);
    return data;
  }
);

export const fetchCategoriesByParent = createAsyncThunk(
  "categories/fetchCategoriesByParent",
  async (parentId) => {
    const data = await categoryService.getCategoriesByParent(parentId);
    return data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData) => {
    const data = await categoryService.createCategory(categoryData);
    return data;
  }
);





const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [],
    currentCategory: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })


      .addCase(fetchCategoryById.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchCategoryById.fulfilled, (state, action) => {
  state.loading = false;
  state.currentCategory = action.payload;
})
.addCase(fetchCategoryById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.error.message;
})


.addCase(fetchCategoriesByParent.pending, (state) => { state.loading = true; state.error = null; })
.addCase(fetchCategoriesByParent.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
.addCase(fetchCategoriesByParent.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

.addCase(createCategory.pending, (state) => { state.loading = true; state.error = null; })
.addCase(createCategory.fulfilled, (state, action) => { state.loading = false; state.items.push(action.payload); })
.addCase(createCategory.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })

  },
});

export default categoriesSlice.reducer;
