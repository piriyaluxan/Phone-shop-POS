import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchProductsApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
  adjustStockApi,
} from "../../api/productApi";

// Thunks
export const fetchProducts = createAsyncThunk(
  "inventory/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fetchProductsApi(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  },
);

export const createProduct = createAsyncThunk(
  "inventory/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await createProductApi(productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to create");
    }
  },
);

export const updateProduct = createAsyncThunk(
  "inventory/updateProduct",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: updated } = await updateProductApi(id, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update");
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "inventory/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await deleteProductApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete");
    }
  },
);

export const adjustStock = createAsyncThunk(
  "inventory/adjustStock",
  async ({ id, adjustment, reason }, { rejectWithValue }) => {
    try {
      const { data } = await adjustStockApi(id, { adjustment, reason });
      return data.product;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to adjust");
    }
  },
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    products: [],
    pagination: { total: 0, page: 1, pages: 1 },
    loading: false,
    error: null,
    // UI state
    selectedProduct: null,
    modalMode: null, // 'add' | 'edit' | 'stock' | 'delete' | null
  },
  reducers: {
    openModal: (state, action) => {
      state.modalMode = action.payload.mode;
      state.selectedProduct = action.payload.product || null;
    },
    closeModal: (state) => {
      state.modalMode = null;
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      // Fetch
      .addCase(fetchProducts.pending, pending)
      .addCase(fetchProducts.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products = payload.products;
        state.pagination = payload.pagination;
      })
      .addCase(fetchProducts.rejected, rejected)

      // Create
      .addCase(createProduct.pending, pending)
      .addCase(createProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.products.unshift(payload); // add to top of list
        state.modalMode = null;
      })
      .addCase(createProduct.rejected, rejected)

      // Update
      .addCase(updateProduct.pending, pending)
      .addCase(updateProduct.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.products.findIndex((p) => p._id === payload._id);
        if (idx !== -1) state.products[idx] = payload;
        state.modalMode = null;
      })
      .addCase(updateProduct.rejected, rejected)

      // Delete
      .addCase(deleteProduct.pending, pending)
      .addCase(deleteProduct.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== id);
        state.modalMode = null;
      })
      .addCase(deleteProduct.rejected, rejected)

      // Stock adjustment
      .addCase(adjustStock.pending, pending)
      .addCase(adjustStock.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.products.findIndex((p) => p._id === payload._id);
        if (idx !== -1) state.products[idx] = payload;
        state.modalMode = null;
      })
      .addCase(adjustStock.rejected, rejected);
  },
});

export const { openModal, closeModal, clearError } = inventorySlice.actions;
export default inventorySlice.reducer;
