import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TestCaseType = {
  input: string;
  output: string;
};

export type QuestionType = {
  _id: string;
  title: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  constraints: string[];
  testCases: TestCaseType[];
  createdAt: string;
  updatedAt: string;
};

export interface QuestionState {
  question: QuestionType | null;
}

const initialState: QuestionState = {
  question: null,
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setQuestion: (state, action: PayloadAction<QuestionType>) => {
      state.question = action.payload;
    },
    clearQuestion: (state) => {
      state.question = null;
    },
  },
});

export const { setQuestion, clearQuestion } = questionSlice.actions;
export default questionSlice.reducer;
