import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Properly typed User
export type UserType = {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  rating: number;
  rank: string;

  social: {
    linkedin?: string;
    x?: string;
    github?: string;
    reddit?: string;
  };

  stats: {
    totalMatches: number;
    wins: number;
    losses: number;
    draws: number;
    problemsSolved: number;
    winStreak: number;
    maxStreak: number;
  };

  createdAt: string;
  lastActive: string;
};

export interface UserState {
  user: UserType | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
