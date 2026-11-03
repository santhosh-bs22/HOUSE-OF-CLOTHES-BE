const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.controller");
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");
const { Roles } = require("../constants/roles");

router.post("/initial-setup", adminController.initialSetup);

router.post("/login", adminController.login);

router.use(authMiddleware);
router.use(authorizeRoles(Roles.ADMIN));

router.post(
  "/products",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  productController.createProduct,
);

router.get("/products", productController.getAllAdminProducts);

router.put(
  "/products/:id",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  productController.updateProduct,
);

router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
