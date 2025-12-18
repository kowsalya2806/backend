// const express = require("express");
// const router = express.Router();
// const { getCart, addToCart } = require("../controllers/cartController");

// router.get("/", getCart);
// router.post("/", addToCart);
// module.exports = router;

const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.post("/add", cartController.addToCart);
router.get("/:userId", cartController.getCart);
router.delete("/remove", cartController.removeFromCart);

module.exports = router;
