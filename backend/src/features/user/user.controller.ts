import { HttpStatus } from "../../utils/http-status";
import userDao from "./user.dao";

const UserController = {
  getData: (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "Uaser not found." });
    }
    return res.status(HttpStatus.OK).json({ user });
  },
  exists: async (req, res) => {
    const user = req.user;
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized." });
    }

    const { email } = req.body;

    if (!email) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    const searchUserData = await userDao.findByEmail(email);
    if (!searchUserData) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: "No such user found." });
    }

    return res.status(HttpStatus.OK).json({ searchUserData });
  },
};

export default UserController;
