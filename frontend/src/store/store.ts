import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import challengesReducer from "./slices/challenges.slice";
import questionReducer from "./slices/question.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    challenges: challengesReducer,
    question: questionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
