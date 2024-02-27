const mongoose = require("mongoose");

let CommentLikeSchema = new mongoose.Schema({
  like_id: {
    type: String,
    required: true,
  },
  comment_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

const comment_likes = mongoose.model("comment_likes", CommentLikeSchema);
module.exports = comment_likes;
