import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MenstruationDayType = 'BLEEDING' | 'FERTILITY' | 'OVULATION' | undefined;

interface MenstrationDays {
  date: string;
  type?: MenstruationDayType;
  note?: string;
}

interface CycleInfo {
  cycleStartDate: string;
  cycleEndDate: string;
}

interface MenstruationState {
  menstrationDays: MenstrationDays[];
  cycleInfo: CycleInfo | null;
}

const initialState: MenstruationState = {
  menstrationDays: [],
  cycleInfo: null,
};

const menstruationSlice = createSlice({
  name: 'menstrationDays',
  initialState,
  reducers: {
    setMenstruationData(state, action: PayloadAction<MenstruationState>) {
      state.menstrationDays = action.payload.menstrationDays;
      state.cycleInfo = action.payload.cycleInfo;
    }
  }
});

export const { setMenstruationData } = menstruationSlice.actions;
export default menstruationSlice.reducer;
