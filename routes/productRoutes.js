const express = require("express");
const router = express.Router();
const Product = require("../validations/Products");
const User = require("../validations/Users");
const checkRole = require("../middlewares/checkRole");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});


router.post("/create", checkRole("businessOwner"), async (req, res) => {
  try {
    const { name, price } = req.body;
    if (!name || !price)
      return res.status(400).json({ message: "Name and price required" });

    const newProduct = new Product({
      name,
      price,
      ownerId: req.user._id, 
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created", product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating product" });
  }
});


router.delete("/:id", checkRole("manager", "businessOwner"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.user.role === "businessOwner" && product.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can only delete your own products" });
    }

    await Product.findByIdAndDelete(product._id);
    res.json({ message: "Product deleted successfully", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while deleting product", error: err.message });
  }
});

module.exports = router;