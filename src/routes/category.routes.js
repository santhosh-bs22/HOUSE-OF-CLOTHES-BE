const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Customer Fetch: View all categories
router.get("/", productController.getCategories);

module.exports = router;

