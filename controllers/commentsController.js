import { StatusCodes } from "http-status-codes";
import Comment from "../models/CommentModel.js";

const postComment = async (req, res) => {
  const {content, author, post} = req.body
  console.log(req.body)
  try {
    if (!content || !author || !post) {
      return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "postID, content, and authorID are required" });
    }
    const comments = await Comment.create(req.body)
    res.status(StatusCodes.CREATED).json({comments})
  } catch (error) {
    res.status(500)
  }
}

export {postComment}