const mongoose = require("mongoose");

let ProductImageSchema = new mongoose.Schema({
  product_imge_id: {
    type: Number,
    required: true,
    unique: true,
  },
  images: {
    type: Array,
    required: true,
  },
  product_id: {
    type: Number,
    required: true,
    unique: true,
  },
});

const product_images = mongoose.model("product_images", ProductImageSchema);
module.exports = product_images;
