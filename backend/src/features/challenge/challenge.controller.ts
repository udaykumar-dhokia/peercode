import generateQuestion from "../../agents/question-agent";
import { HttpStatus } from "../../utils/http-status";
import questionDao from "../question/question.dao";
import challengeDao from "./challenge.dao";

const ChallengeController = {
  create: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    const { to, difficulty, category, duration, note, toEmail } = req.body;

    if (!to || !difficulty || !category || !duration || !toEmail) {
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
        byEmail: user.email,
        toEmail: toEmail,
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

  accept: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }
    const { challengeID, category, difficulty } = req.body;
    if (!challengeID || !category || !difficulty) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }
    try {
      const problem = await generateQuestion(category, difficulty);
      if (!problem) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Intenal Server Error." });
      }
      const question = await questionDao.create(problem);
      console.log(question);
      const acceptedChallenge = await challengeDao.accept({
        challengeID: challengeID,
        questionID: question._id,
      });
      if (!acceptedChallenge) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Intenal Server Error." });
      }
      return res
        .status(HttpStatus.ACCEPTED)
        .json({ message: "Challenge Accepted", acceptedChallenge });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Intenal Server Error.", error });
    }
  },
};

export default ChallengeController;
