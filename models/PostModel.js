import mongoose from "mongoose";
import slugify from "slugify";

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "provide title of blog"],
    },
    content: {
      type: String,
      required: [true, "provide content of blog"],
    },
    image: {
      type: String,
      required: [true, "provide image of blog"],
    },
    slug: {
      type: String,
      unique: true,
    },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

postSchema.pre("save", function (next) {
  this.slug = slugify(this.title +'-' + this._id, { lower: true });
  next();
});

const Post = mongoose.model("Post", postSchema);

export default Post;
