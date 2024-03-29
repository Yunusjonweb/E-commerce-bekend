const mongoose = require("mongoose");

let OrderItemSchema = new mongoose.Schema({
  order_item_id: {
    type: String,
    required: true,
    unique: true,
  },
  product_id: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },  
  order_id: {
    type: String,
    required: true,
  },
});

const order_items = mongoose.model("order_items", OrderItemSchema);
module.exports = order_items;
