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
  isLoading: boolean;
}

const initialState: QuestionState = {
  question: null,
  isLoading: false,
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setQuestion, clearQuestion, setLoading } = questionSlice.actions;
export default questionSlice.reducer;
