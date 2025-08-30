// controllers/productController.js
const Product = require("../models/Product");

// Only admin can add
const addProduct = async (req, res) => {
  try {
    const { name, category, description, sku, stockQty, unit, location, expiryDate } = req.body;
    const product = new Product({
      name,
      category,
      description,
      sku,
      stockQty,
      unit,
      location,
      expiryDate,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { addProduct, getProducts };
