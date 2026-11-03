const Product = require("../models/product.model");
const { uploadBufferToCloudinary, uploadUrlToCloudinary } = require("./cloudinary.services");
const mongoose = require("mongoose");

class ProductServices {

  async createProduct(data, files, adminId) {
    let thumbnailUrl = data.thumbnail || "";
    let rawImagesList = [];

    if (typeof data.images === "string") {
      try {
        rawImagesList = JSON.parse(data.images);
      } catch (e) {
        rawImagesList = data.images.split(",").map(s => s.trim()).filter(Boolean);
      }
    } else if (Array.isArray(data.images)) {
      rawImagesList = [...data.images];
    }

    let imagesList = [];

    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        const thumbFile = files.thumbnail[0];
        thumbnailUrl = await uploadBufferToCloudinary(thumbFile.buffer);
      }

      if (files.images && files.images.length > 0) {
        for (const imgFile of files.images) {
          const uploadedUrl = await uploadBufferToCloudinary(imgFile.buffer);
          imagesList.push(uploadedUrl);
        }
      }
    }

    if (thumbnailUrl && thumbnailUrl.startsWith("http") && !thumbnailUrl.includes("res.cloudinary.com")) {
      try {
        thumbnailUrl = await uploadUrlToCloudinary(thumbnailUrl);
      } catch (err) {
        console.warn(`Could not upload thumbnail link to Cloudinary, skipping: ${err.message}`);
        thumbnailUrl = "";
      }
    }

    // Image links conversion
    for (const imgUrl of rawImagesList) {
      if (typeof imgUrl === "string" && imgUrl.startsWith("http")) {
        if (imgUrl.includes("res.cloudinary.com")) {
          // Already on Cloudinary
          imagesList.push(imgUrl);
        } else {
          try {
            const uploadedUrl = await uploadUrlToCloudinary(imgUrl);
            imagesList.push(uploadedUrl);
          } catch (err) {
            console.warn(`Image link failed on Cloudinary, skipping broken link: ${err.message}`);
            // Skipped completely
          }
        }
      } else if (typeof imgUrl === "string" && imgUrl.trim() !== "") {
        imagesList.push(imgUrl);
      }
    }

    // Fallback: If thumbnail failed or was not provided, use first valid image
    if (!thumbnailUrl && imagesList.length > 0) {
      thumbnailUrl = imagesList[0];
    }

    if (!thumbnailUrl) {
      throw new Error("Product requires at least one valid image or accessible image URL for the thumbnail");
    }

    const product = await Product.create({
      title: data.title,
      description: data.description,
      price: Number(data.price),
      discountPercentage: data.discountPercentage !== undefined ? Number(data.discountPercentage) : 0,
      rating: data.rating !== undefined ? Number(data.rating) : 0,
      stock: Number(data.stock),
      brand: data.brand,
      category: data.category,
      thumbnail: thumbnailUrl,
      images: imagesList,
      createdBy: adminId,
    });

    return product;
  }

  /**
   * Customer fetch: only active products
   */
  async getCustomerProducts(query = {}) {
    const filter = { isActive: true };

    if (query.category) {
      filter.category = new RegExp(query.category, "i");
    }
    if (query.brand) {
      filter.brand = new RegExp(query.brand, "i");
    }
    if (query.search) {
      filter.$or = [
        { title: new RegExp(query.search, "i") },
        { description: new RegExp(query.search, "i") },
        { brand: new RegExp(query.search, "i") },
        { category: new RegExp(query.search, "i") }
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    return products;
  }

  /**
   * Get single product by ID (Customer fetch)
   */
  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Product ID format");
    }

    const product = await Product.findOne({ _id: id, isActive: true });
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  /**
   * Admin: Get all products
   */
  async getAllAdminProducts() {
    return await Product.find().populate("createdBy", "name email").sort({ createdAt: -1 });
  }

  /**
   * Admin: Update product
   */
  async updateProduct(id, data, files) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Product ID format");
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new Error("Product not found");
    }

    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        const thumbFile = files.thumbnail[0];
        product.thumbnail = await uploadBufferToCloudinary(thumbFile.buffer);
      }

      if (files.images && files.images.length > 0) {
        for (const imgFile of files.images) {
          const uploadedUrl = await uploadBufferToCloudinary(imgFile.buffer);
          product.images.push(uploadedUrl);
        }
      }
    }

    if (data.title) product.title = data.title;
    if (data.description) product.description = data.description;
    if (data.price !== undefined) product.price = Number(data.price);
    if (data.discountPercentage !== undefined) product.discountPercentage = Number(data.discountPercentage);
    if (data.rating !== undefined) product.rating = Number(data.rating);
    if (data.stock !== undefined) product.stock = Number(data.stock);
    if (data.brand) product.brand = data.brand;
    if (data.category) product.category = data.category;
    if (data.thumbnail && (!files || !files.thumbnail)) {
      if (data.thumbnail.startsWith("http") && !data.thumbnail.includes("res.cloudinary.com")) {
        try {
          product.thumbnail = await uploadUrlToCloudinary(data.thumbnail);
        } catch (e) {
          console.warn("Could not upload updated thumbnail to Cloudinary, skipping");
        }
      } else {
        product.thumbnail = data.thumbnail;
      }
    }
    if (data.isActive !== undefined) product.isActive = data.isActive;

    await product.save();
    return product;
  }

  /**
   * Admin: Delete product
   */
  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid Product ID format");
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

module.exports = new ProductServices();
