const Order = require("../models/Order");
const Cart = require("../models/Cart");

/**
 * PLACE ORDER (FROM CART)
 * POST /orders/place
 */
const placeOrder = async (req, res) => {
  try {
    const { userId, paymentMethod } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;

    const orderProducts = cart.products.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    const order = await Order.create({
      user: userId,
      products: orderProducts,
      totalAmount,
      paymentMethod,
      status: "Placed",
    });

    // clear cart after order
    cart.products = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET USER ORDERS
 * GET /orders/:userId
 */
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
      .populate("products.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};
