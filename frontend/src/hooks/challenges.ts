import axiosInstance from "../utils/axiosInstance";

export const persistChallengeData = async () => {
  try {
    const res = await axiosInstance.get("/challenge/get-user-challenges");
    return res.data.challenges || null;
  } catch (error) {
    return null;
  }
};
