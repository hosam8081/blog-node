import mongoose from "mongoose";

const { Schema } = mongoose;

const CommentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }], // Array of Like references
  },
  { timestamps: true }
);

const Comment = mongoose.model("comment", CommentSchema);

export default Comment;
