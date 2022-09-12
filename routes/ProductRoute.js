const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");

const {
  addProduct,
  getAllProduct,
  getProductById,
  addProductToCart,
  getProductInCart,
  getProductsNameByQuery,
  getProductsBySearchStatus,
  removeProductFromCart,
} = require("../controllers/ProductController");

router.post("/admin/add", auth, addProduct);
router.get("/products", getAllProduct);
router.get("/product/:id", getProductById);
router.get("/product/search/:query", getProductsNameByQuery);
router.patch("/product/cart", auth, addProductToCart);
router.get("/product/cart/:userId", auth, getProductInCart);
router.post("/products/search", getProductsBySearchStatus);
router.delete("/product/remove/:productId", auth, removeProductFromCart);

module.exports = router;
