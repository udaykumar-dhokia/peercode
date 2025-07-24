import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    by: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    to: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: mongoose.Types.ObjectId, ref: "Question", default: null },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isCompleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
