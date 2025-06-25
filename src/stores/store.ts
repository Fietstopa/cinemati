// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";

// === Konfigurace globálního Redux storu ===
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// === Typy pro použití v celé aplikaci ===
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
