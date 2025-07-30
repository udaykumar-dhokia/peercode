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

  async accept(payload) {
    const challenge = await Challenge.findById(payload.challengeID);
    if (challenge.status !== "pending") {
      throw new Error("Challenge has already been responded to");
    }
    challenge.question = payload.questionID;
    challenge.status = "accepted";
    await challenge.save();
    return challenge;
  }

  async start(payload) {
    const challenge = await Challenge.findById(payload.challengeID);
    if (!challenge) {
      return null;
    }

    const startDate = new Date();
    const endDate = new Date(
      startDate.getTime() + challenge.duration * 60 * 1000
    );

    if (challenge.byEmail === payload.email) {
      challenge.byStats.startedAt = startDate;
      challenge.byStats.endsAt = endDate;
    } else if (challenge.toEmail === payload.email) {
      challenge.toStats.startedAt = startDate;
      challenge.toStats.endsAt = endDate;
    } else {
      throw new Error("User is not part of this challenge");
    }

    await challenge.save();

    return {
      startedAt: startDate,
      endsAt: endDate,
      duration: challenge.duration,
    };
  }
}

export default new ChallengeDAO();
