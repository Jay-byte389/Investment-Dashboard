/**
 * store/index.ts
 * Configures and exports the Redux store and typed hooks.
 */

import { configureStore } from '@reduxjs/toolkit';
import dealReducer from './dealSlice';
import investorReducer from './investorSlice';
import savedDealsReducer from './savedDealsSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    deals: dealReducer,
    investors: investorReducer,
    savedDeals: savedDealsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
