import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Types } from "mongoose";

export interface ChallengeType {
  by?: Types.ObjectId;
  to?: Types.ObjectId;
  duration: number;
  category: string;
  difficulty: string;
  question?: Types.ObjectId | null;
  note?: string;
  status: "pending" | "accepted" | "rejected";
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  toEmail: string;
  byEmail: string;
}

interface ChallengeState {
  challenges: ChallengeType[];
}

const initialState: ChallengeState = {
  challenges: [],
};

const challengesSlice = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    setChallenges: (state, action: PayloadAction<ChallengeType[]>) => {
      state.challenges = action.payload;
    },
    addChallenge: (state, action: PayloadAction<ChallengeType>) => {
      state.challenges.push(action.payload);
    },
  },
});

export const { setChallenges, addChallenge } = challengesSlice.actions;
export default challengesSlice.reducer;
