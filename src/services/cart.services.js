const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

class CartServices {
  async getCart(userId) {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    return cart;
  }

  async addItem(userId, productId, quantity = 1) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const product = await Product.findOne({ _id: productId, isActive: true });
    if (!product) {
      throw new Error("Product not found or unavailable");
    }

    if (product.stock < quantity) {
      throw new Error(`Insufficient stock. Available: ${product.stock}`);
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
      cart.items[existingIndex].price = product.price;
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price,
      });
    }

    await cart.save();
    return await cart.populate("items.product");
  }

  async updateItemQuantity(userId, productId, quantity) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const qty = Number(quantity);
    if (qty < 1) {
      return await this.removeItem(userId, productId);
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    if (product.stock < qty)
      throw new Error(`Only ${product.stock} items in stock`);

    let cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!item) throw new Error("Item not found in cart");

    item.quantity = qty;
    item.price = product.price;

    await cart.save();
    return await cart.populate("items.product");
  }

  async removeItem(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString(),
    );

    await cart.save();
    return await cart.populate("items.product");
  }
}

module.exports = new CartServices();
