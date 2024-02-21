const mongoose = require("mongoose");

let ProductsSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
  product_name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  product_slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  is_rec: {
    type: Boolean,
    required: true,
    default: false,
  },
  is_best: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const products = mongoose.model("products", ProductsSchema);
module.exports = products;
