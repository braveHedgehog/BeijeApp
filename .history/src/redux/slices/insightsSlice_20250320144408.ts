import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Insight {
  _id: string;
  title: string;
  content: string;
}

interface InsightsState {
  insights: Insight[];
}

const initialState: InsightsState = {
  insights: []
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsights(state, action: PayloadAction<Insight[]>) {
      state.insights = action.payload;
    }
  }
});

export const { setInsights } = insightsSlice.actions;
export default insightsSlice.reducer;
