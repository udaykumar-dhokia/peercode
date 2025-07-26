import generateQuestion from "../../agents/question-agent";
import { HttpStatus } from "../../utils/http-status";
import { validateProblem } from "../../utils/validate-problem";
import questionDao from "./question.dao";

const QuestionController = {
  create: async (req, res) => {
    const user = req.user;

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    const { category, difficulty } = req.body;
    if (!category || !difficulty) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Missing required fields.",
      });
    }

    try {
      const problem = await generateQuestion(category, difficulty);

      const validation = validateProblem(problem);

      if (!validation.success) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: "Agent returned invalid problem structure.",
          errors: validation.error.format(),
          rawProblem: problem,
        });
      }

      const newQuestion = await questionDao.create(validation.data);

      return res.status(HttpStatus.OK).json({ newQuestion });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to generate problem.", error: error.message });
    }
  },

  get: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }
    const id = req.params.id;
    if (!id) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: "Missing required fields.",
      });
    }
    try {
      const question = await questionDao.get({ id });

      if (!question) {
        return res.status(HttpStatus.NOT_FOUND).json({
          message: "Question not found.",
        });
      }
      return res.status(HttpStatus.OK).json({ question });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to generate problem.", error: error.message });
    }
  },
};

export default QuestionController;
