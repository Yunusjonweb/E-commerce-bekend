const mongoose = require("mongoose");

let CommentImagesSchema = new mongoose.Schema({
  comment_image_id: {
    type: String,
    required: true,
    unique: true,
  },
  comment_id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const comment_images = mongoose.model("comment_images", CommentImagesSchema);
module.exports = comment_images;
