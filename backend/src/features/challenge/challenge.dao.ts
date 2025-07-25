import Challenge from "./challenge.model";

class ChallengeDAO {
  async create(payload) {
    const challenge = new Challenge({
      by: payload.by,
      to: payload.to,
      category: payload.category,
      difficulty: payload.difficulty,
      note: payload.note,
      duration: payload.duration,
      byEmail: payload.byEmail,
      toEmail: payload.toEmail,
    });

    return await challenge.save();
  }

  async getUserChallenges(id) {
    const challenges = await Challenge.find({ $or: [{ by: id }, { to: id }] });
    return challenges;
  }
}

export default new ChallengeDAO();
