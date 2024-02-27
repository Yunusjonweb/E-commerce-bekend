const mongoose = require("mongoose");

let CommentDisLikeSchema = new mongoose.Schema({
  dis_like_id: {
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

const comment_dislikes = mongoose.model(
  "comment_dislikes",
  CommentDisLikeSchema
);
module.exports = comment_dislikes;
