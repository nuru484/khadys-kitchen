import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "@/redux/api-slice";
import authReducer from "@/redux/auth/auth-slice";

/**
 * A fresh store shaped exactly like the production one (auth slice + the single
 * apiSlice + its middleware) so RTK Query endpoints behave as they do in the
 * app. Build one per test to keep the query cache and auth state isolated.
 *
 * No Testing Library import here on purpose: the data-layer test runs in the
 * `node` environment (jsdom's AbortSignal clashes with undici's fetch), so this
 * helper must stay DOM-free.
 */
export function makeTestStore() {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
  });
  setupListeners(store.dispatch);
  return store;
}

export type TestStore = ReturnType<typeof makeTestStore>;
