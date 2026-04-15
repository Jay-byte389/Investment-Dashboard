/**
 * uiSlice.ts
 * Global UI state: sidebar, dark mode, active investor profile.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  activeInvestorId: number; // simulated "logged in" investor
}

const initialState: UIState = {
  sidebarOpen: true,
  darkMode: true,
  activeInvestorId: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) { state.sidebarOpen = !state.sidebarOpen; },
    setSidebarOpen(state, action: PayloadAction<boolean>) { state.sidebarOpen = action.payload; },
    toggleDarkMode(state) { state.darkMode = !state.darkMode; },
    setActiveInvestor(state, action: PayloadAction<number>) { state.activeInvestorId = action.payload; },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode, setActiveInvestor } = uiSlice.actions;
export default uiSlice.reducer;
