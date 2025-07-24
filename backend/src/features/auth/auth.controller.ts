import { HttpStatus } from "../../utils/http-status";
import userDao, { UserType } from "../user/user.dao";
import dotenv from "dotenv";
import { CookieOptions } from "express";
import { comparePassword, hashPassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  maxAge: 24 * 60 * 60 * 1000,
};

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const user = await userDao.findByEmail(email);
      if (!user || !(await comparePassword(password, user.password))) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "Invalid credentials." });
      }
      const token = signToken({ id: user._id });
      res.cookie("token", token, cookieOptions);
      return res
        .status(HttpStatus.OK)
        .json({ message: "Login successful.", user, token });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },
  register: async (req, res) => {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Missing required fields." });
    }

    try {
      const hashedPassword = await hashPassword(password);
      const payload: UserType = {
        fullName,
        email,
        password: hashedPassword,
      };
      const exists = await userDao.findByEmail(email);
      if (exists) {
        return res
          .status(HttpStatus.CONFLICT)
          .json({ message: "User already exists." });
      }
      const user = await userDao.create(payload);
      const token = await signToken({ id: user._id });
      if (!token) {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: "Internal Server Error." });
      }
      res.cookie("token", token, cookieOptions);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: "Registration successful", user });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal Server Error." });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });

      return res.status(HttpStatus.OK).json({ message: "Logout successful." });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Failed to log out." });
    }
  },
};

export default AuthController;
