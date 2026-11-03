const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");

class WishlistServices {
  async getWishlist(userId) {
    let wishlist = await Wishlist.findOne({ user: userId }).populate("products");
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async addItem(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({ user: userId, products: [] });
    }

    const alreadyAdded = wishlist.products.some(
      (id) => id.toString() === productId.toString()
    );

    if (!alreadyAdded) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    return await wishlist.populate("products");
  }

  async removeItem(userId, productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new Error("Wishlist not found");

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();
    return await wishlist.populate("products");
  }
}

module.exports = new WishlistServices();

