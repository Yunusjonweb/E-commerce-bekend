const mongoose = require("mongoose");

let CartSchema = new mongoose.Schema({
  cart_id: {
    type: Number,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    required: true,
    default: 1,
    min: 1,
  },
  product_id: {
    type: Number,
    required: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
});

const cart = mongoose.model("carts", CartSchema);
module.exports = cart;
