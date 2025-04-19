import { Schema, model } from "mongoose";

const OrderSchema = new Schema(
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

export default model("Order", OrderSchema);
