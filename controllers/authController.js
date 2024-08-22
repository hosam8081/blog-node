import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import BadRequestError from "../errors/bad-request.js";
import { StatusCodes } from "http-status-codes";

const registerUser = async (req, res) => {
  const { username, password, email, permissions } = req.body;

  try {
    const existUser = await User.find({ username: username });
    if (existUser.length > 0) {
      
     return res.status(StatusCodes.BAD_REQUEST).json({message: "user with this username aleardy exist"});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUsersCount = await User.countDocuments();
    const isAdmin = existingUsersCount === 0;

    const newUser = {
      username,
      email: email,
      isAdmin,
      permissions
    }
    const createNewUser = await User.create({...newUser, password: hashedPassword,});

    res
      .status(201)
      .json({ message: "user Registerd successfully", user: newUser });
  } catch (error) {
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: "no username exist" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: "password is wrong" });
  }

  const token = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin, permissions: user.permissions},
    process.env.JWT_SECRET
  );

  res.status(201).json({
    message: "Login successful",
    user: {
      token,
      username: user.username,
      _id: user._id,
      email: user.email,
      image: user.image,
      isAdmin: user.isAdmin,
      permissions: user.permissions
    },
  });
};

export { registerUser, loginUser };
