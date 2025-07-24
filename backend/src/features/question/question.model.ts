import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    input: { type: String, required: true },
    output: { type: String, required: true },
  },
  { _id: false }
);

const QuestionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    description: { type: String, required: true },
    constraints: {
      type: [String],
      required: true,
      validate: [(val) => val.length >= 1, "At least one constraint required"],
    },
    testCases: {
      type: [TestCaseSchema],
      required: true,
      validate: [(val) => val.length >= 5, "At least 5 test cases required"],
    },
  },
  {
    timestamps: true,
  }
);

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
