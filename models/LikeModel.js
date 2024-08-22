import mongoose from "mongoose";

const {Schema} = mongoose;


const LikeSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Reference to Post (for post likes)
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference to Comment (for comment likes)
})


const Like = mongoose.model('Like', likeSchema);

