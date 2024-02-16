const mongoose = require("mongoose");

let OrderItemSchema = new mongoose.Schema({
  order_item_id: {
    type: Number,
    required: true,
    unique: true,
  },
  product_id: {
    type: Number,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  order_id: {
    type: Number,
    required: true,
  },
});

const order_items = mongoose.model("order_items", OrderItemSchema);
module.exports = order_items;