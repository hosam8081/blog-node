import { StatusCodes } from "http-status-codes";
import Post from "../models/PostModel.js";
import Comment from "../models/CommentModel.js";

const postCreate = async (req, res) => {
  const { title, content, category } = req.body;
  const author = req.user.id;

  try {
    let errors = {};

    // Validate title
    if (!title) {
      errors.title = ["Title is required"];
    }

    // Validate content
    if (!content) {
      errors.content = ["Content is required"];
    }

    // Validate image
    let image;
    if (req.file && typeof req.file === "object") {
      image = req.file.path; // Use the file path if a file was uploaded
    } else if (req.body.image && typeof req.body.image === "string") {
      image = req.body.image;
    } else {
      errors.image = ["Image file is required"];
    }

    // If there are any errors, return them with a 400 status
    if (Object.keys(errors).length > 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors, message:"faild to add post" });
    }

    const post = await Post.create({
      message: "Blog successfully created",
      image,
      content,
      title,
      author,
      category,
    });

    res.json({ message: "Blog successfully created", post });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
const getAllBlogs = async (req, res) => {
  const { search } = req.query;

  // --- pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // ----search -----
  let params = {};
  if (search) {
    params.title = { $regex: search, $options: "i" };
  }

  try {
    const posts = await Post.find(params)
      .populate({
        path: "author",
        select: "username email",
      })
      .skip(skip)
      .limit(limit);

    // --- GET totalCount ----
    const totalCount = await Post.countDocuments(params);
    const totalPages = Math.ceil(totalCount / limit);

    //-- response ----
    res.status(200).json({ page, count: totalCount, total_pages: totalPages, results:posts  });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error });
  }
};

const getBlog = async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await Post.findOne({ _id: slug }).populate({path: "author", select: "id username email"});
    const comment = await Comment.find({ post: slug })
    .populate({path: "author", select: "id username email"})


    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "blog with this id not exist" });
    }

    res.status(StatusCodes.OK).json({ post, comment });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error });
  }
};

const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByIdAndDelete({ _id: id });

    if (!post) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "blog with this id not exist" });
    }

    res.status(StatusCodes.OK).json({ message: "successfully Delete" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "server error", error: error });
  }
};

const changeBlog = async (req, res) => {
  const { id } = req.params;
  const { body, file } = req;

  try {
    // Prepare update data
    const updateBlog = { ...body };
    if (file) {
      updateBlog.image = file.path;
    }

    // Find and update user
    const updatedUser = await Post.findByIdAndUpdate(id, updateBlog, {
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

export { postCreate, getAllBlogs, getBlog, deleteBlog, changeBlog };
