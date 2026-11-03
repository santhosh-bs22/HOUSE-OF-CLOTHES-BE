const wishlistServices = require("../services/wishlist.services");

class WishlistController {
  async getWishlist(req, res) {
    try {
      const wishlist = await wishlistServices.getWishlist(req.user.id);
      return res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        data: wishlist,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addItem(req, res) {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId is required",
        });
      }

      const wishlist = await wishlistServices.addItem(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Item added to wishlist",
        data: wishlist,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeItem(req, res) {
    try {
      const { productId } = req.params;
      const wishlist = await wishlistServices.removeItem(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Item removed from wishlist",
        data: wishlist,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new WishlistController();

