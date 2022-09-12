const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const Order = require("../models/OrderModel");

const registerUser = async (req, res) => {
  try {
    const userDetails = new User(req.body);
    userDetails.role = req.body.role;
    const userSaved = await userDetails.save();

    if (userDetails.role === "user") {
      res.status(201).send({
        status: "success",
        message: "User Registered Successfully",
        data: userDetails,
      });
    } else {
      res.status(201).send({
        status: "success",
        message: "Admin Registered Successfully",
        data: userDetails,
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Registeration Failed",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    const isMatch = await bcrypt.compare(req.body.password, userData.password);
    if (userData.tokens.length !== 0) {
      userData.tokens = [];
    }
    const token = await userData.generateToken();
    if (isMatch && userData.role === req.body.role) {
      res.status(200).send({
        status: "success",
        data: userData,
        token: token,
        message: `${req.body.role} Login Successful`,
      });
    } else if (isMatch && userData.role !== req.body.role) {
      res.status(401).send({
        status: "failed",
        message: "Invalid Details",
      });
    } else {
      res.status(401).send({
        status: "failed",
        message: "Invalid Password",
      });
    }
  } catch (error) {
    res.status(401).send({
      status: "failed",
      message: "Invalid Email Id",
    });
  }
};

const userInfo = async (req, res) => {
  try {
    const userFind = await User.findById({ _id: req.body.id });
    res.status(200).send({
      status: "success",
      data: userFind,
      message: "User Details fetched successfully",
    });
  } catch (error) {
    res.status(404).send({
      status: "failed",
      message: "Cannot fetch login details. Please refresh",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((currToken) => {
      return currToken.token !== req.token;
    });
    await req.user.save();
    res.status(200).send({
      status: "success",
      message: "User Logged Out Successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: "failed",
      message: "Internal Error. Please try again later",
    });
  }
};

const viewOrders = async (req, res) => {
  let finalData;
  try {
    const orderFind = await Order.find({ "user.id": req.params.userId }).sort({
      createdAt: -1,
    });
    if (req.query.orderStatus === "success-orders") {
      finalData = orderFind.filter((order) => {
        return (
          order.orderStatus === "delivered" || order.orderStatus === "returned"
        );
      });
    } else if (req.query.orderStatus === "cancelled-orders") {
      finalData = orderFind.filter((order) => {
        return order.orderStatus === "cancelled";
      });
    } else if (req.query.orderStatus === "inprocess-orders") {
      finalData = orderFind.filter((order) => {
        return (
          order.orderStatus === "pending" ||
          order.orderStatus === "dispatched" ||
          order.orderStatus === "confirmed"
        );
      });
    }
    for (let i = 0; i < finalData.length; i++) {
      await finalData[i].populate({
        path: "products.id",
      });
    }
    res.status(200).send({
      status: "success",
      data: finalData,
      message: "Orders fetched successfully",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch orders. please try again later",
    });
  }
};

module.exports = { registerUser, loginUser, userInfo, logoutUser, viewOrders };
