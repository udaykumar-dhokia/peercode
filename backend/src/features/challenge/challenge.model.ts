import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema(
  {
    byEmail: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    toEmail: {
      type: String,
      ref: "User",
      required: true,
      index: true,
    },
    by: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    to: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    duration: { type: Number, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: mongoose.Types.ObjectId, default: null },
    note: { type: String },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    isCompleted: { type: Boolean, default: false },

    byStartedAt: { type: Date, default: null },
    toStartedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

const Challenge = mongoose.model("Challenge", challengeSchema);
export default Challenge;
