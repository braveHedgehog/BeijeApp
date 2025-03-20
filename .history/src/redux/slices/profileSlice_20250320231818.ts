import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileInfo {
  firstName: string;
  lastName: string;
  email: string;
  birthDate?: string;
}

interface ProfileState {
  _id: string | null;
  profileInfo: ProfileInfo | null;
  cycleStatus: {
    isRegistrationComplete: boolean;
    inOnboardingCompleted: boolean;
  } | null;
}

const initialState: ProfileState = {
  _id: null,
  profileInfo: null,
  cycleStatus: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<ProfileState>) {
      state._id = action.payload._id;
      state.profileInfo = action.payload.profileInfo;
      state.cycleStatus = action.payload.cycleStatus;
    }
  }
});

export const { setProfile } = profileSlice.actions;
export default profileSlice.reducer;
