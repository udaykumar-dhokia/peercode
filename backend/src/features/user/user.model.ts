import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  social: {
    linkedin: { type: String },
    x: { type: String },
    github: { type: String },
    reddit: { type: String },
  },
  avatar: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    default: 1000,
  },
  rank: {
    type: String,
    default: "Novice",
  },
  stats: {
    totalMatches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    winStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
  },
});

const User = mongoose.model("User", userSchema);
export default User;
