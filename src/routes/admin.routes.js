const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const { Roles } = require("../constants/roles");

// Admin Auth Endpoints
router.post("/auth/login", adminController.login);
router.post("/initial-setup", adminController.initialSetup);

// Protected Admin Product Routes
router.use(authMiddleware);
router.use(authorizeRoles(Roles.ADMIN));

router.post(
  "/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  productController.createProduct
);

router.get("/products", productController.getAllAdminProducts);
router.get("/products/:id", productController.getAdminProductById);

router.put(
  "/products/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 }
  ]),
  productController.updateProduct
);

router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
