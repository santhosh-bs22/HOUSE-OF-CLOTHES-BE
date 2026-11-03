const orderServices = require("../services/order.services");

class OrderController {
  async placeOrder(req, res) {
    try {
      const order = await orderServices.placeOrder(req.user.id, req.body);
      return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        data: order,
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async getMyOrders(req, res) {
    try {
      const orders = await orderServices.getMyOrders(req.user.id);
      return res.status(200).json({
        success: true,
        message: "Orders fetched successfully",
        count: orders.length,
        data: orders,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new OrderController();

