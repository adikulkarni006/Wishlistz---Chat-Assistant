import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const getJWTSecret = () => process.env.JWT_SECRET;
const getJWTExpiry = () => process.env.JWT_EXPIRY || "7d";


class AuthService {
  static async register({ name, email, password }) {
    if (!email || !password) throw new Error("Email and password required");

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already registered");

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    // strip sensitive fields
    return { _id: user._id, name: user.name, email: user.email, preferences: user.preferences || {} };
  }

  static async login({ email, password }) {
    if (!email || !password) throw new Error("Email and password required");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");

    const token = jwt.sign(
  { userId: user._id },
   process.env.JWT_SECRET,
  { expiresIn: process.env.JWT_EXPIRY || "7d" }
);

    return { token, user: { _id: user._id, name: user.name, email: user.email } };
  }

  static async verifyToken(token) {
    try {
      return jwt.verify(token, getJWTSecret());
    } catch (err) {
      return null;
    }
  }
}

export default AuthService;
