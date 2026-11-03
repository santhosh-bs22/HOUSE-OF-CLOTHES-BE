const cartServices = require("../services/cart.services");

class CartController {
  async getCart(req, res) {
    try {
      const cart = await cartServices.getCart(req.user.id);
      return res.status(200).json({
        success: true,
        message: "Cart fetched successfully",
        data: cart,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async addItem(req, res) {
    try {
      const { productId, quantity } = req.body;
      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "productId is required",
        });
      }

      const cart = await cartServices.addItem(
        req.user.id,
        productId,
        quantity || 1,
      );
      return res.status(200).json({
        success: true,
        message: "Item added to cart",
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateItem(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      if (quantity === undefined) {
        return res.status(400).json({
          success: false,
          message: "quantity is required",
        });
      }

      const cart = await cartServices.updateItemQuantity(
        req.user.id,
        productId,
        quantity,
      );
      return res.status(200).json({
        success: true,
        message: "Cart updated successfully",
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async removeItem(req, res) {
    try {
      const { productId } = req.params;
      const cart = await cartServices.removeItem(req.user.id, productId);
      return res.status(200).json({
        success: true,
        message: "Item removed from cart",
        data: cart,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new CartController();
