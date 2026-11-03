const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Customer Fetch: View all products with filtering, search, sorting & pagination
router.get("/", productController.getCustomerProducts);

// Customer Fetch: View single product details
router.get("/:id", productController.getProductById);

module.exports = router;
