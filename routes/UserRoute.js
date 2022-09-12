const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const {
  registerUser,
  loginUser,
  userInfo,
  logoutUser,
  viewOrders,
} = require("../controllers/UserController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/user/info", userInfo);
router.get("/logout/:id", auth, logoutUser);
router.get("/view/orders/:userId", auth, viewOrders);

module.exports = router;
