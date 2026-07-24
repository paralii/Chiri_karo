import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "../../types/auth.types";
import { tokenStore } from "../../lib/tokenStore";
import { getProfileRequest, refreshRequest } from "../../api/auth.api";

export type AuthStatus =
  "idle" | "loading" | "authenticated" | "unauthenticated";

export interface AuthState {
  user: AuthUser | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
};

export const bootstrapSession = createAsyncThunk<AuthUser | null>(
  "auth/bootstrapSession",
  async () => {
    try {
      const accessToken = await refreshRequest();
      tokenStore.setAccessToken(accessToken);
      return await getProfileRequest();
    } catch {
      tokenStore.clearAccessToken();
      return null;
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearSession(state) {
      state.user = null;
      state.status = "unauthenticated";
      tokenStore.clearAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.status = "loading";
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = action.payload ? "authenticated" : "unauthenticated";
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.status = "unauthenticated";
      });
  },
});

export const { setSession, clearSession } = authSlice.actions;
export const authReducer = authSlice.reducer;
