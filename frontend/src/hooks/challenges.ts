import axiosInstance from "../utils/axiosInstance";

export const persistChallengeData = async () => {
  try {
    const res = await axiosInstance.get("/challenge/get-user-challenges");
    return res.data.challenges || null;
  } catch (error) {
    return null;
  }
};

export const persistQuestionData = async (id: string) => {
  try {
    const res = await axiosInstance.get(`/question/get/${id}`);
    return res.data.question || null;
  } catch (error) {
    return null;
  }
};
