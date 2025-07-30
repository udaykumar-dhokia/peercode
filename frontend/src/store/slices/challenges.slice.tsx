import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { Types } from "mongoose";

export type ChallengeType = {
  _id?: Types.ObjectId;
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
  byStats?: {
    startedAt?: Date;
    endsAt?: Date;
  };
  toStats?: {
    startedAt?: Date;
    endsAt?: Date;
  };
};

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
    acceptChallenge: (state, action: PayloadAction<{ id: string }>) => {
      const challenge = state.challenges.find(
        (c) => c._id?.toString() === action.payload.id.toString()
      );
      if (challenge) {
        challenge.status = "accepted";
      }
    },
  },
});

export const { setChallenges, addChallenge, acceptChallenge } =
  challengesSlice.actions;
export default challengesSlice.reducer;
