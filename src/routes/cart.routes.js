const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", cartController.getCart);
router.post("/items", cartController.addItem);
router.put("/items/:productId", cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);

module.exports = router;

