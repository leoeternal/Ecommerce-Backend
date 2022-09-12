const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  createOrder,
  updateOrderAddress,
  updatePaymentMethod,
  orderPlaced,
  getOrderById,
} = require("../controllers/OrderController");

router.post("/order", auth, createOrder);
router.post("/order/address", auth, updateOrderAddress);
router.patch("/order/payment/update", auth, updatePaymentMethod);
router.patch("/order/placed", auth, orderPlaced);
router.get("/order/:orderId", auth, getOrderById);

module.exports = router;
