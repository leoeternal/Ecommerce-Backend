const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      default: [],
    },
    slug: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    deliveryDays: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    detail: {
      type: String,
    },
    features: {
      type: Array,
      default: [],
    },
    tags: {
      type: Array,
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
