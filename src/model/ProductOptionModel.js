const mongoose = require("mongoose");

let ProductOptionSchema = new mongoose.Schema({
  product_option_id: {
    type: String,
    required: true,
    unique: true,
  },
  key: {
    type: Array,
    required: true,
  },
  value: {
    type: Array,
    required: true,
  },
  product_id: {
    type: String,
    required: true,
    unique: true,
  },
});

const product_option = mongoose.model("product_option", ProductOptionSchema);
module.exports = product_option;
