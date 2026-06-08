import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchRepairsApi,
  fetchRepairByIdApi,
  createRepairApi,
  updateRepairApi,
  updateStatusApi,
  deleteRepairApi,
} from "../../api/repairApi";

export const fetchRepairs = createAsyncThunk(
  "repairs/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await fetchRepairsApi(params);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

export const fetchRepairById = createAsyncThunk(
  "repairs/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await fetchRepairByIdApi(id);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

export const createRepair = createAsyncThunk(
  "repairs/create",
  async (repairData, { rejectWithValue }) => {
    try {
      const { data } = await createRepairApi(repairData);
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

export const updateRepair = createAsyncThunk(
  "repairs/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const { data: updated } = await updateRepairApi(id, data);
      return updated;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

export const updateStatus = createAsyncThunk(
  "repairs/updateStatus",
  async ({ id, status, note }, { rejectWithValue }) => {
    try {
      const { data } = await updateStatusApi(id, { status, note });
      return data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

export const deleteRepair = createAsyncThunk(
  "repairs/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteRepairApi(id);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || "Failed");
    }
  },
);

const repairSlice = createSlice({
  name: "repairs",
  initialState: {
    repairs: [],
    selectedRepair: null,
    pagination: { total: 0, page: 1, pages: 1 },
    loading: false,
    detailLoading: false,
    error: null,
    modalMode: null, // 'create' | 'edit' | 'status' | 'delete' | null
  },
  reducers: {
    openModal: (state, { payload }) => {
      state.modalMode = payload.mode;
      if (payload.repair) state.selectedRepair = payload.repair;
    },
    closeModal: (state) => {
      state.modalMode = null;
    },
    clearSelected: (state) => {
      state.selectedRepair = null;
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
    const rejected = (state, { payload }) => {
      state.loading = false;
      state.error = payload;
    };

    builder
      .addCase(fetchRepairs.pending, pending)
      .addCase(fetchRepairs.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.repairs = payload.repairs;
        state.pagination = payload.pagination;
      })
      .addCase(fetchRepairs.rejected, rejected)

      .addCase(fetchRepairById.pending, (state) => {
        state.detailLoading = true;
      })
      .addCase(fetchRepairById.fulfilled, (state, { payload }) => {
        state.detailLoading = false;
        state.selectedRepair = payload;
      })
      .addCase(fetchRepairById.rejected, (state) => {
        state.detailLoading = false;
      })

      .addCase(createRepair.pending, pending)
      .addCase(createRepair.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.repairs.unshift(payload);
        state.modalMode = null;
      })
      .addCase(createRepair.rejected, rejected)

      .addCase(updateRepair.pending, pending)
      .addCase(updateRepair.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.repairs.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.repairs[idx] = payload;
        if (state.selectedRepair?._id === payload._id)
          state.selectedRepair = payload;
        state.modalMode = null;
      })
      .addCase(updateRepair.rejected, rejected)

      .addCase(updateStatus.pending, pending)
      .addCase(updateStatus.fulfilled, (state, { payload }) => {
        state.loading = false;
        const idx = state.repairs.findIndex((r) => r._id === payload._id);
        if (idx !== -1) state.repairs[idx] = payload;
        state.selectedRepair = payload;
        state.modalMode = null;
      })
      .addCase(updateStatus.rejected, rejected)

      .addCase(deleteRepair.pending, pending)
      .addCase(deleteRepair.fulfilled, (state, { payload: id }) => {
        state.loading = false;
        state.repairs = state.repairs.filter((r) => r._id !== id);
        state.modalMode = null;
      })
      .addCase(deleteRepair.rejected, rejected);
  },
});

export const { openModal, closeModal, clearSelected, clearError } =
  repairSlice.actions;
export default repairSlice.reducer;
