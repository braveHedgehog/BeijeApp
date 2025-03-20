import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { Insights } from '../../types';
import { RootState } from '../store';

const initialState: { data: Insights | null } = { data: null };

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsights: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { setInsights } = insightsSlice.actions;

// Temel selector
const selectInsightsData = (state: RootState) => state.insights.data;

// Memoize edilmiş selector
export const selectInsights = createSelector(
  [selectInsightsData],
  (insightsData) => insightsData?.insights || []
);

export default insightsSlice.reducer;