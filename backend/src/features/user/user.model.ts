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
});

const User = mongoose.model("User", userSchema);
export default User;
