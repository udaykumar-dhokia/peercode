import User from "./user.model";

export type UserType = {
  fullName: string;
  email: string;
  password: string;
};

class UserDAO {
  // Find user by id
  async findByID(id: string) {
    return await User.findById(id);
  }

  // Find user by email
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }

  // Create new user
  async create(payload: UserType) {
    const user = new User({
      fullName: payload.fullName,
      email: payload.email,
      password: payload.password,
    });
    return user.save();
  }
}
export default new UserDAO();
