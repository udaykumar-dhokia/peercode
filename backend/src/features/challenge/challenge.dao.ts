import Challenge from "./challenge.model";

class ChallengeDAO {
  async create(payload) {
    const challenge = new Challenge({
      by: payload.by,
      to: payload.to,
      category: payload.category,
      difficulty: payload.difficulty,
    });

    return await challenge.save();
  }

  async getUserChallenges(id) {
    const challenges = await Challenge.find({ by: id });
    return challenges;
  }
}

export default new ChallengeDAO();
