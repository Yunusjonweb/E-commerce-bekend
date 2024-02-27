const mongoose = require("mongoose");

let OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
  },
  shopping_region: {
    type: String,
    required: true,
  },
  shopping_address: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: "Payed",
  },
});

const order = mongoose.model("order", OrderSchema);
module.exports = order;
