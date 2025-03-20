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
  menstruationDays: MenstrationDays[];
  cycleInfo: CycleInfo | null;
}

const initialState: MenstruationState = {
  menstruationDays: [],
  cycleInfo: null
};

const menstruationSlice = createSlice({
  name: 'menstrationDays',
  initialState,
  reducers: {
    setMenstruationData(state, action: PayloadAction<MenstruationState>) {
      state.menstruationDays = action.payload.menstruationDays;
      state.cycleInfo = action.payload.cycleInfo;
    }
  }
});

export const { setMenstruationData } = menstruationSlice.actions;
export default menstruationSlice.reducer;
