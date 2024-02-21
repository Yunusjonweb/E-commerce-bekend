const mongoose = require("mongoose");

let OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true,
  },
  user_id: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
});

const order = mongoose.model("order", OrderSchema);
module.exports = order;
