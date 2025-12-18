// const express = require("express");
// const fs = require("fs");
// const router = express.Router();

// router.get("/", (req, res) => {
//   const products = fs.readFileSync("products.json");
//   res.json(JSON.parse(products));
// });

// router.get("/:id", (req, res) => {
//   console.log("id= ", req.params.id);
//   const product = products.find((p) => {
//     return p.id === parseInt(req.params.id);
//   });
//   if (product) {
//     console.log("Product= ", product);
//   } else {
//     console.log("not defined");
//   }
//   res.json(product);
// });

// router.delete("/:id", (req, res) => {
//   const products = fs.readFileSync("products.json");
//   const updatedProducts = JSON.parse(products).filter((p) => {
//     return p.id !== parseInt(req.params.id);
//   });
//   fs.writeFileSync("products.json", JSON.stringify(updatedProducts, null, 2));
//   res.status(200).json({ message: "Product deleted successFully" });
// });

// router.post("/", (req, res) => {
//   const products = JSON.parse(fs.readFileSync("products.json"));
//   const newProduct = {
//     id: products[products.length - 1].id + 1,
//     name: req.body.name,
//     price: req.body.price,
//     image: req.body.image,
//   };
//   const updatedProducts = [...products, newProduct];
//   fs.writeFileSync("products.json", JSON.stringify(updatedProducts, null, 2));
//   res.status(201).json({ message: "Product added successFully" });
// });

// module.exports = router;

//

const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
