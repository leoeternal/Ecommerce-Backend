const Product = require("../models/ProductModel");
const User = require("../models/UserModel");

const addProduct = async (req, res) => {
  console.log(req.body);
  try {
    const productCreated = new Product(req.body);
    const productSaved = await productCreated.save();
    res.status(201).send({
      status: "success",
      data: productCreated,
      message: "Product created successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot create product now. Please try again later",
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send({
      status: "success",
      data: products,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch products. Please try again later",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById({ _id: req.params.id });
    res.status(200).send({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch the product. Please try again later",
    });
  }
};

const addProductToCart = async (req, res) => {
  const id = req.body.productId;
  try {
    const findUser = await User.findById({ _id: req.user._id });
    const status =
      findUser.cartProducts.length !== 0 &&
      findUser.cartProducts.find((product) => {
        return product.id.toString() === id;
      });
    if (status === false || status === undefined) {
      await User.findByIdAndUpdate(
        { _id: req.user._id },

        {
          $inc: { cartQuantity: 1 },
          $push: { cartProducts: { id: id, quantity: 1 } },
        }
      );
    } else {
      const user = await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $inc: { cartQuantity: 1 },
        }
      );
      user.cartProducts.map((product) => {
        if (product.id.toString() === id) {
          product.quantity++;
        }
      });
      await user.save();
    }

    const updatedUser = await User.findById({ _id: req.user._id });
    res.status(200).send({
      staus: "success",
      message: "Product added successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot update the cart. Please try again later",
    });
  }
};

const getProductInCart = async (req, res) => {
  try {
    const userFind = await User.findById({ _id: req.params.userId });
    await userFind.populate("cartProducts.id");
    res.status(200).send({
      status: "success",
      message: "Fetch all products in cart",
      data: userFind,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch the products from cart. Please try again later",
    });
  }
};

const getProductsNameByQuery = async (req, res) => {
  const q = req.params.query;
  const regex = new RegExp(q, "i");
  let data = [];
  try {
    const productsByName = await Product.find({
      $or: [{ name: { $regex: regex } }, { slug: { $regex: regex } }],
    });
    productsByName.forEach((product) => {
      data.push({
        name: product.name,
        slug: product.slug,
        status: "name",
        productId: product._id,
        category: product.category,
      });
    });
    const productsByTags = await Product.find({
      tags: { $regex: regex },
    });
    productsByTags.forEach((product) => {
      data.push({
        slug: product.slug,
        name: product.name,
        status: "tags",
        productId: product._id,
      });
    });
    res.status(200).send({
      status: "success",
      data: data,
      message: "Products Fetched Successfuly",
    });
  } catch (error) {
    res.status(400).send({
      message: "Cannot fetch products. Please try again later",
      status: "failed",
    });
  }
};

const getProductsBySearchStatus = async (req, res) => {
  let sortOrder;
  if (req.query.sort === "lowtohigh") {
    sortOrder = { price: 1 };
  } else if (req.query.sort === "hightolow") {
    sortOrder = { price: -1 };
  } else if (sortOrder === "featured") {
    sortOrder = { createdAt: -1 };
  }
  const q = req.body.query;
  const regex = new RegExp(q, "i");
  try {
    if (req.body.status === "name") {
      const productsLength = await Product.find({
        $or: [{ name: { $regex: regex } }, { slug: { $regex: regex } }],
      });
      const productsByName = await Product.find({
        $or: [{ name: { $regex: regex } }, { slug: { $regex: regex } }],
      })
        .sort(sortOrder)
        .limit(2)
        .skip(2 * Number(req.query.page));

      res.status(200).send({
        status: "success",
        data: productsByName,
        message: "Products Fetched",
        totalProducts: productsLength.length,
      });
    } else if (req.body.status === "tags") {
      const productsLength = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { slug: { $regex: regex } },
          { tags: { $regex: regex } },
        ],
      });
      const productsByTags = await Product.find({
        $or: [
          { name: { $regex: regex } },
          { slug: { $regex: regex } },
          { tags: { $regex: regex } },
        ],
      })
        .sort(sortOrder)
        .limit(2)
        .skip(2 * Number(req.query.page));

      res.status(200).send({
        status: "success",
        data: productsByTags,
        message: "Products Fetched",
        totalProducts: productsLength.length,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch products. Please try again later",
    });
  }
};

const removeProductFromCart = async (req, res) => {
  try {
    const userFind = await User.findById({ _id: req.user._id });

    const product = userFind.cartProducts.find((product) => {
      return product.id.toString() === req.params.productId;
    });
    if (product.quantity > 1) {
      for (var i = 0; i < userFind.cartProducts.length; i++) {
        if (userFind.cartProducts[i].id.toString() === product.id.toString()) {
          userFind.cartProducts[i].quantity--;
        }
      }
      await userFind.save();
    } else {
      const userFindAndUpdate = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { cartProducts: { id: product.id } } },
        { safe: true, multi: false }
      );
    }
    const userFindAndUpdate = await User.findOneAndUpdate(
      { _id: req.user._id },
      { $inc: { cartQuantity: -1 } }
    );
    const updatedUser = await User.findById({ _id: req.user._id });
    res.status(200).send({
      status: "success",
      data: updatedUser,
      messgae: "Product removed from the cart",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot remove product. Please try again later",
    });
  }
};

module.exports = {
  addProduct,
  getAllProduct,
  getProductById,
  addProductToCart,
  getProductInCart,
  getProductsNameByQuery,
  getProductsBySearchStatus,
  removeProductFromCart,
};
