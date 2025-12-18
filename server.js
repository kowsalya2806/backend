/*Node.js server code*/

/*const http=require('http');

const server=http.createServer((req,res)=>{
    if(req.method==='GET' && req.url==='/'){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({message:"Hello"}));
    }
    else if(req.method==='GET' && req.url==='/about'){
        res.writeHead(200,{'Content-Type':'application/json'});
        res.end(JSON.stringify({message:"About"}));
    }
    else{
        res.writeHead(404,{'Content-Type':'application/json'});
        res.end(JSON.stringify({Error:"Not Found"}));
    }
});

server.listen(3000,()=>{
    console.log("Server is running on port http://localhost:3000")
})*/

//In Express
//instead of import we use require
require("dotenv").config();
const express = require("express");
// const fs = require("fs");
const app = express();
app.use(express.json());

const productsRouter = require("./routes/product");
const studentRouter = require("./routes/students.js");
const authMiddleware = require("./middleware/authMiddleware");
const authRouter = require("./routes/auth");
const createDB = require("./config/db");
const User = require("./models/User");
const cartroutes = require("./routes/cart");
const orderRoutes = require("./routes/order");
createDB();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const product = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    image:
      "https://tse4.mm.bing.net/th/id/OIP.qeXkjS3N8ovfxk6vt0s99wHaFi?pid=Api&P=0&h=180",
  },
  {
    id: 2,
    name: "Product 2",
    price: 200,
    image:
      "https://tse2.mm.bing.net/th/id/OIP.gQlq98xdp1zCf6eW2zwFEgHaMd?pid=Api&P=0&h=180",
  },
  {
    id: 3,
    name: "Product 3",
    price: 300,
    image:
      "https://tse3.mm.bing.net/th?id=OIF.KPGB1CMRw2G6%2faJ6QnLziw&pid=Api&P=0&h=180",
  },
];
app.get("/", (req, res) => {
  res.json({ message: "Hello Express!" });
});

app.get("/about", (req, res) => {
  res.json({ message: "About" });
});

/*
// //to access the produt array inside the server page
// app.get("/products",(req,res)=>{
//     res.json(products);
// })
// */
// //to get products from products.json
// app.get("/products", (req, res) => {
//   const products = fs.readFileSync("products.json");
//   res.json(JSON.parse(products));
// });
// app.get("/products/:id", (req, res) => {
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

// // // // "*" -> if it is not / or /about it comes to this case, all represent get,post,put,delete etc., it returns possible output
// // // app.all("*",(req,res)=>{
// // //     res.json({error:"Hello Not Found"});
// // // });

// app.delete("/products/:id", (req, res) => {
//   const products = fs.readFileSync("products.json");
//   const updatedProducts = JSON.parse(products).filter((p) => {
//     return p.id !== parseInt(req.params.id);
//   });
//   fs.writeFileSync("products.json", JSON.stringify(updatedProducts, null, 2));
//   res.status(200).json({ message: "Product deleted successFully" });
// });

// app.post("/products", (req, res) => {
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

app.use("/products", productsRouter);
app.use("/students", authMiddleware, studentRouter);
app.use("/auth", authRouter);
app.use("/cart", cartroutes);
app.use("/order", orderRoutes);

app.get("/profile", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userData.id).select("-password");
  res.status(200).json({ message: "Profile", userData: user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
