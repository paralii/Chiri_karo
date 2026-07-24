import { RootState } from "../store";

export const selectAuthUser = (state: RootState): RootState["auth"]["user"] =>
  state.auth.user;

export const selectAuthStatus = (
  state: RootState,
): RootState["auth"]["status"] => state.auth.status;

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.status === "authenticated";

export const selectIsInitializing = (state: RootState): boolean =>
  state.auth.status === "idle" || state.auth.status === "loading";
