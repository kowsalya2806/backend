const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// ✅ SPECIFIC routes FIRST
router.post("/place", orderController.placeOrder);

// ✅ PARAM routes LAST
router.get("/:userId", orderController.getUserOrders);

module.exports = router;
