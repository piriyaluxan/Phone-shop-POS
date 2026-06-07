import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSaleApi, getSalesApi, refundSaleApi } from "../../api/saleApi";
import { fetchProductsApi } from "../../api/productApi";

// Submit sale to backend
export const submitSale = createAsyncThunk(
  "pos/submitSale",
  async (saleData, { rejectWithValue }) => {
    try {
      const { data } = await createSaleApi(saleData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Sale failed");
    }
  },
);

// Fetch sales history
export const fetchSales = createAsyncThunk(
  "pos/fetchSales",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await getSalesApi(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch");
    }
  },
);

// Search product by barcode or SKU
export const lookupProduct = createAsyncThunk(
  "pos/lookupProduct",
  async (search, { rejectWithValue }) => {
    try {
      const { data } = await fetchProductsApi({ search, limit: 5 });
      return data.products;
    } catch (err) {
      return rejectWithValue("Product lookup failed");
    }
  },
);

// Refund a sale
export const refundSale = createAsyncThunk(
  "pos/refundSale",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await refundSaleApi(id);
      return data.sale;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Refund failed");
    }
  },
);

const posSlice = createSlice({
  name: "pos",
  initialState: {
    // Cart
    cartItems: [],
    orderDiscount: 0, // LKR off the whole order
    customer: { name: "", phone: "" },

    // Payment
    paymentMethod: "cash",
    amountPaid: "",

    // UI state
    screen: "pos", // 'pos' | 'payment' | 'receipt'
    completedSale: null, // populated after successful submit

    // Search
    searchResults: [],
    searchLoading: false,

    // Sales history
    sales: [],
    pagination: { total: 0, page: 1, pages: 1 },

    loading: false,
    error: null,
  },
  reducers: {
    // Cart management
    addToCart: (state, { payload: product }) => {
      const existing = state.cartItems.find((i) => i.product === product._id);
      if (existing) {
        existing.quantity += 1;
        existing.lineTotal =
          existing.sellingPrice * existing.quantity - existing.discount;
      } else {
        state.cartItems.push({
          product: product._id,
          name: product.name,
          sku: product.sku,
          sellingPrice: product.sellingPrice,
          costPrice: product.costPrice,
          maxQty: product.quantity,
          quantity: 1,
          discount: 0,
          lineTotal: product.sellingPrice,
        });
      }
      state.searchResults = [];
    },
    removeFromCart: (state, { payload: productId }) => {
      state.cartItems = state.cartItems.filter((i) => i.product !== productId);
    },
    updateQty: (state, { payload: { productId, quantity } }) => {
      const item = state.cartItems.find((i) => i.product === productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(quantity, item.maxQty));
        item.lineTotal = item.sellingPrice * item.quantity - item.discount;
      }
    },
    updateItemDiscount: (state, { payload: { productId, discount } }) => {
      const item = state.cartItems.find((i) => i.product === productId);
      if (item) {
        item.discount = Math.max(0, discount);
        item.lineTotal = Math.max(
          0,
          item.sellingPrice * item.quantity - item.discount,
        );
      }
    },
    setOrderDiscount: (state, { payload }) => {
      state.orderDiscount = Math.max(0, payload);
    },
    setPaymentMethod: (state, { payload }) => {
      state.paymentMethod = payload;
    },
    setAmountPaid: (state, { payload }) => {
      state.amountPaid = payload;
    },
    setCustomer: (state, { payload }) => {
      state.customer = { ...state.customer, ...payload };
    },
    setScreen: (state, { payload }) => {
      state.screen = payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    resetCart: (state) => {
      state.cartItems = [];
      state.orderDiscount = 0;
      state.customer = { name: "", phone: "" };
      state.amountPaid = "";
      state.paymentMethod = "cash";
      state.screen = "pos";
      state.completedSale = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lookup
      .addCase(lookupProduct.pending, (state) => {
        state.searchLoading = true;
      })
      .addCase(lookupProduct.fulfilled, (state, { payload }) => {
        state.searchLoading = false;
        state.searchResults = payload;
      })
      .addCase(lookupProduct.rejected, (state) => {
        state.searchLoading = false;
      })

      // Submit sale
      .addCase(submitSale.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitSale.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.completedSale = payload;
        state.screen = "receipt";
      })
      .addCase(submitSale.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSales.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.sales = payload.sales;
        state.pagination = payload.pagination;
      })
      .addCase(fetchSales.rejected, (state) => {
        state.loading = false;
      })

      // Refund
      .addCase(refundSale.fulfilled, (state, { payload }) => {
        const idx = state.sales.findIndex((s) => s._id === payload._id);
        if (idx !== -1) state.sales[idx] = payload;
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQty,
  updateItemDiscount,
  setOrderDiscount,
  setPaymentMethod,
  setAmountPaid,
  setCustomer,
  setScreen,
  clearSearchResults,
  resetCart,
} = posSlice.actions;

export default posSlice.reducer;
