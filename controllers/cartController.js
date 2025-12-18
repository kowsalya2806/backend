// // const Cart = require("../models/Cart");
// // const Product = require("../models/Product");

// // const getCart = async (req, res) => {
// //   const cart = await Cart.findOne({ user: req.userData.id }).populate(
// //     "products.product"
// //   );

// //   if (!cart) {
// //     return res.status(200).json({ message: "Cart not found", cart: [] });
// //   }

// //   res.status(200).json({ cart });
// // };

// // const addToCart = async (req, res) => {
// //   const { productId, quantity } = req.body;
// //   const cart = await Cart.findOne({ user: req.userData.id });

// //   if (!cart) {
// //     // create a cart and add
// //     const newCart = await Cart.create({
// //       user: req.userData.id,
// //       products: [{ product: productId, quantity }],
// //     });
// //     return res.status(200).json({ message: "Cart created", cart: newCart });
// //   }
// //   const product = await Product.findById(productId);
// //   if (!product) {
// //     return res.status(404).json({ error: "Product not found" });
// //   }
// //   cart.products.push({ product: productId, quantity });
// //   await cart.save();
// //   res.status(200).json({ message: "Product added to cart", cart });
// // };

// // module.exports = { getCart, addToCart };
// const Cart = require("../models/Cart");
// const Product = require("../models/Product");

// const getCart = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const cart = await Cart.findOne({ user: userId }).populate(
//       "products.product"
//     );

//     if (!cart) {
//       return res.status(200).json({ message: "Cart not found", cart: [] });
//     }

//     res.status(200).json({ cart });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     if (!userId || !productId) {
//       return res.status(400).json({ message: "userId and productId required" });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     let cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//       cart = await Cart.create({
//         user: userId,
//         products: [{ product: productId, quantity }],
//       });

//       return res.status(201).json({
//         message: "Cart created and product added",
//         cart,
//       });
//     }

//     const existingProduct = cart.products.find(
//       (p) => p.product.toString() === productId
//     );

//     if (existingProduct) {
//       existingProduct.quantity += quantity;
//     } else {
//       cart.products.push({ product: productId, quantity });
//     }

//     await cart.save();

//     res.status(200).json({ messag
// e: "Product added to cart", cart });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { getCart, addToCart };
const Cart = require("../models/Cart");
const Product = require("../models/Product");

/**
 * GET CART BY USER
 * GET /cart/:userId
 */
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product"
    );

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: [] });
    }

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ADD TO CART
 * POST /cart/add
 */
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId required" });
    }

    // ✅ Check product exists
    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Find cart (ONE cart per user)
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [],
      });
    }

    // ✅ Check product already in cart
    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity || 1;
    } else {
      cart.products.push({
        product: productId,
        quantity: quantity || 1,
      });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * REMOVE PRODUCT FROM CART
 * DELETE /cart/remove
 */
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({ message: "Product removed", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
};
