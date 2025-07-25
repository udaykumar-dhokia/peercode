import axiosInstance from "../utils/axiosInstance";

export const persistData = async () => {
  try {
    const res = await axiosInstance.get("/user/getdata");
    return res?.data?.user || null;
  } catch {
    return null;
  }
};
