// src/store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth } from "../firebase/config";

// ─── App-specific user shape ──────────────────────────────
interface User {
  uid: string;
  email: string | null;
  photoURL: string | null; // ← fixnuto
}

// ─── State ────────────────────────────────────────────────
interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

// ─── Firebase login/register helpers ──────────────────────
const firebaseLogin = async (
  email: string,
  password: string
): Promise<FirebaseUser> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  console.log("User logged in:", userCredential.user);
  return userCredential.user;
};

const firebaseRegister = async (
  email: string,
  password: string,
  username: string
): Promise<FirebaseUser> => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  await updateProfile(userCredential.user, { displayName: username });
  return userCredential.user;
};

// ─── Thunks ───────────────────────────────────────────────
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    thunkAPI
  ) => {
    try {
      const user = await firebaseLogin(email, password);
      return { uid: user.uid, email: user.email, photoURL: user.photoURL };
    } catch (err) {
      return thunkAPI.rejectWithValue("Login failed.");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (
    {
      email,
      password,
      username,
    }: { email: string; password: string; username: string },
    thunkAPI
  ) => {
    try {
      const user = await firebaseRegister(email, password, username);
      return { uid: user.uid, email: user.email, photoURL: user.photoURL };
    } catch (err) {
      return thunkAPI.rejectWithValue("Registration failed.");
    }
  }
);

// ─── Slice ────────────────────────────────────────────────
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
        // Po registraci se uživatel zatím nepřihlašuje → user zůstává null
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ─── Exporty ──────────────────────────────────────────────
export const { logout } = authSlice.actions;
export default authSlice.reducer;
