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

    const { to, difficulty, category, duration, note } = req.body;

    if (!to || !difficulty || !category || !duration) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const challenge = await challengeDao.create({
        by: user._id,
        to: to,
        difficulty: difficulty,
        category: category,
        note: note,
        duration: duration,
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
      return res.status(HttpStatus.OK).json({ challenges });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Intenal Server Error.", error });
    }
  },
};

export default ChallengeController;
