const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlist.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.use(authMiddleware);

router.get("/", wishlistController.getWishlist);
router.post("/items", wishlistController.addItem);
router.delete("/items/:productId", wishlistController.removeItem);

module.exports = router;
