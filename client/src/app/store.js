import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import inventoryReducer from "../features/inventory/inventorySlice";
import posReducer from "../features/pos/posSlice";
import repairReducer from "../features/repairs/repairSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    pos: posReducer,
    repairs: repairReducer,
  },
});
