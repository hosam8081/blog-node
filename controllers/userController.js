import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";

const getAllUsers = async (req, res) => {
  const { email, username } = req.query;

  // --- pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // search
  let queryObj = {};
  if (email) {
    queryObj.email = { $regex: email, $options: "i" };
  }

  if (username) {
    queryObj.username = { $regex: username, $options: "i" };
  }

  // --- GET totalCount ----
  const totalCount = await User.countDocuments(queryObj);
  const totalPages = Math.ceil(totalCount / limit);

  try {
    const users = await User.find(queryObj).skip(skip).limit(limit);

    res.status(StatusCodes.OK).json({ page, count:totalCount, total_pages:totalPages, results:users });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error: error });
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  const { isAdmin, id: UserID, permissions } = req.user;

  console.log(req.user, permissions);

  try {
    const user = await User.findById({ _id: id });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "user with this id not exist" });
    }

    if (isAdmin || UserID === id || permissions.includes("can_view_user")) {
      res.status(StatusCodes.OK).json(user);
    } else {
      res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "You do not have permission to view this user" });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error: error });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete({ _id: id });

    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "user with this id not exist" });
    }

    res.status(StatusCodes.OK).json({ message: "successfully Delete" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error: error });
  }
};

const changeUser = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;

  try {
    // Prepare update data
    const updateData = { ...body };
    if (file) {
      updateData.image = file.path;
    }

    // Find and update user
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    // Check if user was found and updated
    if (!updatedUser) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Send response
    return res.status(StatusCodes.OK).json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
export { getAllUsers, getUser, deleteUser, changeUser };
