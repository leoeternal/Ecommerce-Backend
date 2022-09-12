const Order = require("../models/OrderModel");
const User = require("../models/UserModel");
const moment = require("moment");

const createOrder = async (req, res) => {
  let order = {};
  try {
    if (req.user.orderInProcess.status === false) {
      if (req.user.address.status === true) {
        order = {
          user: {
            id: req.user._id,
          },
          address: {
            locality: req.user.address.locality,
            road: req.user.address.road,
            city: req.user.address.city,
            state: req.user.address.state,
            pincode: req.user.address.pincode,
            country: req.user.address.country,
          },
          addressStatus: true,
          phone: req.user.phone,
        };
      } else {
        order = {
          user: {
            id: req.user._id,
          },
          phone: req.user.phone,
        };
      }
      const orderCreated = new Order(order);
      const orderSaved = await orderCreated.save();
      const userUpdate = await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            "orderInProcess.id": orderCreated._id,
            "orderInProcess.status": true,
          },
        }
      );

      res.status(201).send({
        status: "success",
        data: orderCreated,
        message: "Order created successfully",
      });
    } else {
      const user = await User.findById({ _id: req.user._id });
      const findOrder = await Order.findById({ _id: user.orderInProcess.id });

      res.status(200).send({
        status: "success",
        data: findOrder,
        message: "Order found successfully",
      });
    }
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot create order. Please try again later",
    });
  }
};

const updateOrderAddress = async (req, res) => {
  let max = 0,
    deliveryDays = 0;
  for (let i = 0; i < req.body.products.length; i++) {
    if (req.body.products[i].id.deliveryDays > max) {
      max = req.body.products[i].id.deliveryDays;
      deliveryDays = max;
    }
  }
  const m = moment().add(deliveryDays, "d");
  try {
    if (req.body.checkboxStatus === true) {
      const userFindAndUpdate = await User.findByIdAndUpdate(
        { _id: req.user._id },
        {
          $set: {
            "address.locality": req.body.address.locality,
            "address.road": req.body.address.road,
            "address.city": req.body.address.city,
            "address.state": req.body.address.state,
            "address.pincode": req.body.address.pincode,
            "address.country": req.body.address.country,
            "address.status": true,
          },
        }
      );
    }
    const orderFindAndUpdate = await Order.findByIdAndUpdate(
      { _id: req.body.orderId },
      {
        $set: {
          "address.locality": req.body.address.locality,
          "address.road": req.body.address.road,
          "address.city": req.body.address.city,
          "address.state": req.body.address.state,
          "address.pincode": req.body.address.pincode,
          "address.country": req.body.address.country,
          addressStatus: true,
          phone: req.body.address.phone,
          totalMoney: req.body.totalAmount,
          deliveryDate: m.format("DD-MMMM-YYYY"),
        },
      }
    );
    res.status(200).send({
      status: 200,
      data: orderFindAndUpdate,
      message: "Order Updated",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot update the address. Please try again later.",
    });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const orderFindAndUpdate = await Order.findByIdAndUpdate(
      { _id: req.body.orderId },
      {
        $set: { paymentMethod: req.body.paymentMethod },
      }
    );
    res.status(200).send({
      status: "success",
      data: orderFindAndUpdate,
      message: "Order payment method updated successfuly",
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot update order payment method",
    });
  }
};

const orderPlaced = async (req, res) => {
  const m = moment();
  let orderId = Math.floor(Math.random() * 1000000 + 1);
  try {
    const userFind = await User.findById({ _id: req.user._id });
    const products = userFind.cartProducts;
    const userFindAndUpdate = await User.findByIdAndUpdate(
      { _id: req.user._id },
      {
        $push: { orders: { id: req.body.orderId } },
        $set: {
          "orderInProcess.status": false,
          cartQuantity: 0,
          cartProducts: [],
        },
      }
    );
    const orderFindAndUpdate = await Order.findByIdAndUpdate(
      { _id: req.body.orderId },
      {
        $set: {
          orderStatus: "pending",
          products: products,
          orderId: orderId,
          orderPlacedDate: m.format("DD-MMM-YYYY"),
        },
      }
    );
    res.status(200).send({
      status: "success",
      message: "Order placed successfully",
      data: orderFindAndUpdate,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot place order.Please try again later",
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const orderFind = await Order.findById({ _id: req.params.orderId });
    res.status(200).send({
      status: "success",
      message: "Order fetched successfully",
      data: orderFind,
    });
  } catch (error) {
    res.status(400).send({
      status: "failed",
      message: "Cannot fetch order. Please try again later",
    });
  }
};

module.exports = {
  createOrder,
  updateOrderAddress,
  updatePaymentMethod,
  orderPlaced,
  getOrderById,
};
