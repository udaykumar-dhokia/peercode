import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/user.slice";
import challengesReducer from "./slices/challenges.slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    challenges: challengesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
