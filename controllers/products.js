const mongodb = require('../data/database');
const ObjectId = require('mongodb').ObjectId;

// GET all products
const getAllProducts = async (req, res) => {
  try {
    const db = mongodb.getDatabase();
    const products = await db.collection("products").find().toArray();
    console.log("Products fetched:", products);
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// GET a single product by id
const getSingleProduct = async (req, res) => {
  try {
    const productId = new ObjectId(req.params.id);
    const product = await mongodb.getDatabase().collection("products").findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// POST Create a new product. All fields are required
const createProduct = async (req, res) => {
  const { name, description, price, category, inStock, rating } = req.body;
  if (!name || !description || price === undefined || !category || inStock === undefined || rating === undefined) {
    return res.status(400).json({ message: "All product fields are required" });
  }
  try {
    const db = mongodb.getDatabase();
    const newProduct = { name, description, price, category, inStock, rating, created: new Date() };
    const result = await db.collection("products").insertOne(newProduct);
    res.setHeader("Content-Type", "application/json");
    res.status(201).json({ id: result.insertedId });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

// PUT Update a product by id
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, category, inStock, rating } = req.body;
  if (!name || !description || price === undefined || !category || inStock === undefined || rating === undefined) {
    return res.status(400).json({ message: "All product fields are required for update" });
  }
  try {
    const db = mongodb.getDatabase();
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(productId) },
      { $set: { name, description, price, category, inStock, rating } }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// DELETE Delete a product by id
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const db = mongodb.getDatabase();
    const result = await db.collection("products").deleteOne({ _id: new ObjectId(productId) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.setHeader("Content-Type", "application/json");
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct
};