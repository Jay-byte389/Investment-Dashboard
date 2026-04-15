/**
 * investorSlice.ts
 * Manages investor data and corporate metrics.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Investor } from '@/types/investor';
import { getInvestors, getCorporateMetrics } from '@/Services/investorService';

interface CorporateMetrics {
  totalInvestors: number;
  totalFundingCommitted: number;
  avgBudget: number;
  totalActiveDeals: number;
  conversionRate: number;
  industryInterest: Record<string, number>;
  riskBreakdown: Record<string, number>;
}

interface InvestorState {
  investors: Investor[];
  corporateMetrics: CorporateMetrics | null;
  loading: boolean;
  metricsLoading: boolean;
  error: string | null;
}

const initialState: InvestorState = {
  investors: [],
  corporateMetrics: null,
  loading: false,
  metricsLoading: false,
  error: null,
};

export const fetchInvestors = createAsyncThunk<Investor[]>(
  'investors/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await getInvestors(); }
    catch (err) { return rejectWithValue((err as Error).message); }
  }
);

export const fetchCorporateMetrics = createAsyncThunk<CorporateMetrics>(
  'investors/fetchCorporateMetrics',
  async (_, { rejectWithValue }) => {
    try { return await getCorporateMetrics(); }
    catch (err) { return rejectWithValue((err as Error).message); }
  }
);

const investorSlice = createSlice({
  name: 'investors',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestors.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchInvestors.fulfilled, (state, action) => { state.loading = false; state.investors = action.payload; })
      .addCase(fetchInvestors.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(fetchCorporateMetrics.pending, (state) => { state.metricsLoading = true; })
      .addCase(fetchCorporateMetrics.fulfilled, (state, action) => { state.metricsLoading = false; state.corporateMetrics = action.payload; })
      .addCase(fetchCorporateMetrics.rejected, (state) => { state.metricsLoading = false; });
  },
});

export default investorSlice.reducer;
