/**
 * savedDealsSlice.ts
 * Manages user's saved/watchlisted deals — persisted to localStorage.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Deal } from '@/types/deal';

const STORAGE_KEY = 'iv_saved_deals';

const loadFromStorage = (): Deal[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveToStorage = (deals: Deal[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(deals));
};

interface SavedDealsState {
  deals: Deal[];
}

const initialState: SavedDealsState = {
  deals: [],
};

const savedDealsSlice = createSlice({
  name: 'savedDeals',
  initialState,
  reducers: {
    hydrateSaved(state) {
      state.deals = loadFromStorage();
    },
    saveDeal(state, action: PayloadAction<Deal>) {
      const exists = state.deals.some((d) => d.id === action.payload.id);
      if (!exists) {
        state.deals.push(action.payload);
        saveToStorage(state.deals);
      }
    },
    removeDeal(state, action: PayloadAction<number>) {
      state.deals = state.deals.filter((d) => d.id !== action.payload);
      saveToStorage(state.deals);
    },
    toggleSaved(state, action: PayloadAction<Deal>) {
      const idx = state.deals.findIndex((d) => d.id === action.payload.id);
      if (idx >= 0) {
        state.deals.splice(idx, 1);
      } else {
        state.deals.push(action.payload);
      }
      saveToStorage(state.deals);
    },
  },
});

export const { hydrateSaved, saveDeal, removeDeal, toggleSaved } = savedDealsSlice.actions;
export default savedDealsSlice.reducer;
