const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    phone: {
      type: String,
      default: "",
    },
    orderStatus: {
      type: String,
      enum: [
        "inprocess",
        "pending",
        "confirmed",
        "dispatched",
        "delivered",
        "rejected",
        "notdelivered",
        "cancelled",
        "returned",
      ],
      default: "inprocess",
    },
    address: {
      locality: {
        type: String,
        default: "",
      },
      road: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      state: {
        type: String,
        default: "",
      },
      pincode: {
        type: String,
        default: "",
      },
      country: {
        type: String,
        default: "",
      },
    },
    addressStatus: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["paid", "failed", "notpaid"],
      default: "notpaid",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "card", "upi"],
      default: "cod",
    },
    totalMoney: {
      type: Number,
      default: 0,
    },
    products: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    orderId: {
      type: String,
      default: "",
    },
    orderPlacedDate: {
      type: String,
    },
    deliveryDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
