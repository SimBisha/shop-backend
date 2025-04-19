const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    userEmail: { type: String }, // ✅ so we can notify the customer

    products: [
      {
        productId: { type: String },
        title: { type: String }, // ✅ add this safely
        quantity: { type: Number, default: 1 },
      },
    ],

    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
