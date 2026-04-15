/**
 * dealSlice.ts
 * Manages deal data, filters, pagination, and loading state.
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Deal, DealQueryParams, DealResponse } from '@/types/deal';
import { getDeals, getDashboardMetrics, getInvestmentGrowth } from '@/Services/dealService';

interface DashboardMetrics {
  totalDeals: number;
  totalFundingRaised: number;
  avgROI: number;
  riskDistribution: { Low: number; Medium: number; High: number };
  industryDistribution: Record<string, number>;
}

interface GrowthPoint {
  month: string;
  amount: number;
  cumulative: number;
}

interface DealState {
  deals: Deal[];
  total: number;
  totalPages: number;
  currentPage: number;
  filters: DealQueryParams;
  metrics: DashboardMetrics | null;
  growthData: GrowthPoint[];
  loading: boolean;
  metricsLoading: boolean;
  error: string | null;
}

const initialState: DealState = {
  deals: [],
  total: 0,
  totalPages: 1,
  currentPage: 1,
  filters: { sort: 'newest', limit: 12, page: 1 },
  metrics: null,
  growthData: [],
  loading: false,
  metricsLoading: false,
  error: null,
};

// Thunks
export const fetchDeals = createAsyncThunk<DealResponse, DealQueryParams>(
  'deals/fetchDeals',
  async (params, { rejectWithValue }) => {
    try {
      return await getDeals(params);
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchDashboardMetrics = createAsyncThunk<DashboardMetrics>(
  'deals/fetchMetrics',
  async (_, { rejectWithValue }) => {
    try {
      return await getDashboardMetrics();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchGrowthData = createAsyncThunk<GrowthPoint[]>(
  'deals/fetchGrowthData',
  async (_, { rejectWithValue }) => {
    try {
      return await getInvestmentGrowth();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const dealSlice = createSlice({
  name: 'deals',
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<DealQueryParams>>) {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
      state.currentPage = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = { sort: 'newest', limit: 12, page: 1 };
      state.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload.data;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.page;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDashboardMetrics.pending, (state) => { state.metricsLoading = true; })
      .addCase(fetchDashboardMetrics.fulfilled, (state, action) => {
        state.metricsLoading = false;
        state.metrics = action.payload;
      })
      .addCase(fetchDashboardMetrics.rejected, (state) => { state.metricsLoading = false; })
      .addCase(fetchGrowthData.fulfilled, (state, action) => {
        state.growthData = action.payload;
      });
  },
});

export const { setFilters, setPage, resetFilters } = dealSlice.actions;
export default dealSlice.reducer;
