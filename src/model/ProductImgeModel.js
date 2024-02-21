const mongoose = require("mongoose");

let ProductImageSchema = new mongoose.Schema({
  imge_id: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
});

const product_images = mongoose.model("product_images", ProductImageSchema);
module.exports = product_images;
