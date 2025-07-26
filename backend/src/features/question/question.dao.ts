import Question from "./question.model";

class QuestionDAO {
  async create(payload) {
    const newQuestion = new Question(payload);
    return await newQuestion.save();
  }

  async get(payload) {
    const question = await Question.findById(payload.id);
    return question;
  }
}
export default new QuestionDAO();
