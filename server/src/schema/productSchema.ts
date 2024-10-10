import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  store: { type: Number, required: true },
  dept: { type: Number, required: true },
  size: { type: Number, required: true },
  type: { type: Number, required: true },
  date: { type: Date, required: true, unique: true, default: Date.now },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
