import Question from "./question.model";

class QuestionDAO {
  async create(payload) {
    const newQuestion = new Question(payload);
    return await newQuestion.save();
  }
}
export default new QuestionDAO();
