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

const selectInsightsData = (state: RootState) => state.insights.data;

export const selectInsights = createSelector(
  [selectInsightsData],
  (insightsData) => insightsData?.insights || []
);

export default insightsSlice.reducer;