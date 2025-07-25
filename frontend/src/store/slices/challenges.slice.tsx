import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Types } from "mongoose";

export interface ChallengeType {
  by: Types.ObjectId;
  to: Types.ObjectId;
  duration: number;
  category: string;
  difficulty: string;
  question?: Types.ObjectId | null;
  note?: string;
  status: "pending" | "accepted" | "rejected";
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ChallengeState {
  challenges: ChallengeType | null;
}

const initialState: ChallengeState = {
  challenges: null,
};

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    setChallenges: (state, action: PayloadAction<ChallengeType>) => {
      state.challenges = action.payload;
    },
  },
});

export const { setChallenges } = challengesSlice.actions;
export default challengesSlice.reducer;
