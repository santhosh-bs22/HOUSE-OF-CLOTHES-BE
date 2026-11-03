const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

class OrderServices {
  async placeOrder(userId, orderData) {
    const { shippingAddress, paymentMethod = "COD", items: directItems } = orderData;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      throw new Error("Complete shipping address is required");
    }

    let orderItems = [];
    let totalAmount = 0;

    if (directItems && Array.isArray(directItems) && directItems.length > 0) {
      // Direct checkout
      for (const item of directItems) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);
        if (product.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }

        orderItems.push({
          product: product._id,
          title: product.title,
          thumbnail: product.thumbnail,
          quantity: item.quantity,
          price: product.price,
        });

        totalAmount += product.price * item.quantity;
        product.stock -= item.quantity;
        await product.save();
      }
    } else {
      // Place order from current user cart
      const cart = await Cart.findOne({ user: userId }).populate("items.product");
      if (!cart || cart.items.length === 0) {
        throw new Error("Your cart is empty");
      }

      for (const cartItem of cart.items) {
        const product = cartItem.product;
        if (!product || !product.isActive) {
          throw new Error(`Product unavailable: ${product ? product.title : "Unknown"}`);
        }
        if (product.stock < cartItem.quantity) {
          throw new Error(`Insufficient stock for ${product.title}`);
        }

        orderItems.push({
          product: product._id,
          title: product.title,
          thumbnail: product.thumbnail,
          quantity: cartItem.quantity,
          price: product.price,
        });

        totalAmount += product.price * cartItem.quantity;
        product.stock -= cartItem.quantity;
        await product.save();
      }

      // Empty user's cart after order placement
      cart.items = [];
      await cart.save();
    }

    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
      orderStatus: "Placed",
    });

    return order;
  }

  async getMyOrders(userId) {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return orders;
  }
}

module.exports = new OrderServices();

