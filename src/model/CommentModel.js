const mongoose = require("mongoose");

let CommentSchema = new mongoose.Schema({
  comment_id: {
    type: String,
    required: true,
    unique: true,
  },
  text: {
    type: String,
    required: true,
  },
  star: {
    type: String,
    required: true,
    min: 1,
    max: 5,
  },
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
});

const comment = mongoose.model("comment", CommentSchema);
module.exports = comment;
