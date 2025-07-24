import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateQuestion(category: string, difficulty: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are an expert algorithm problem writer like LeetCode.

Generate a coding question with the following specifications:
- Category: ${category}
- Difficulty: ${difficulty}

Return the problem in the following JSON format:
{
  "title": "string",
  "category": "${category}",
  "difficulty": "${difficulty}",
  "description": "Full problem description in markdown",
  "constraints": ["Constraint 1", "Constraint 2", "..."],
  "testCases": [
    { "input": "input1", "output": "expectedOutput1" },
    ...
  ]
}

Ensure there are 10 diverse test cases and realistic constraints.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}") + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const problem = JSON.parse(jsonString);
    return problem;
  } catch (error) {
    console.error("Error parsing Gemini response:", error);
    return {
      error: "Failed to parse Gemini response. Raw output:",
      raw: text,
    };
  }
}

export default generateQuestion;
