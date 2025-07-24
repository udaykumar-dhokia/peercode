import { HttpStatus } from "../../utils/http-status";
import challengeDao from "./challenge.dao";

const ChallengeController = {
  create: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    const { by, to, difficulty, category } = req.body;

    if (!by || !to || !difficulty || !category) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const challenge = await challengeDao.create({
        by: by,
        to: to,
        difficulty: difficulty,
        category: category,
      });
      if (!challenge) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Intenal Server Error." });
      }
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Challenge created.", challenge });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Intenal Server Error.", error });
    }
  },

  getUserChallenges: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    try {
      const challenges = await challengeDao.getUserChallenges(user._id);
      if (!challenges) {
        return res.json({ message: "No active challenges.", challenges });
      }
      return res.status(HttpStatus.OK).json({challenges});
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Intenal Server Error.", error });
    }
  },
};

export default ChallengeController;
