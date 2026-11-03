const Product = require("../models/product.model");
const {
  uploadBufferToCloudinary,
  uploadUrlToCloudinary,
} = require("./cloudinary.services");
const mongoose = require("mongoose");

class ProductServices {
  async createProduct(data, files, adminId) {
    let thumbnailUrl = data.thumbnail || "";
    let rawImagesList = [];

    if (typeof data.images === "string") {
      try {
        rawImagesList = JSON.parse(data.images);
      } catch (e) {
        rawImagesList = data.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(data.images)) {
      rawImagesList = [...data.images];
    }

    let imagesList = [];

    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        thumbnailUrl = await uploadBufferToCloudinary(
          files.thumbnail[0].buffer,
        );
      }
      if (files.images && files.images.length > 0) {
        for (const img of files.images) {
          const uploaded = await uploadBufferToCloudinary(img.buffer);
          imagesList.push(uploaded);
        }
      }
    }

    if (
      thumbnailUrl &&
      thumbnailUrl.startsWith("http") &&
      !thumbnailUrl.includes("res.cloudinary.com")
    ) {
      try {
        thumbnailUrl = await uploadUrlToCloudinary(thumbnailUrl);
      } catch (err) {
        console.warn(
          `Could not upload thumbnail to Cloudinary, skipping: ${err.message}`,
        );
        thumbnailUrl = "";
      }
    }

    for (const imgUrl of rawImagesList) {
      if (typeof imgUrl === "string" && imgUrl.startsWith("http")) {
        if (imgUrl.includes("res.cloudinary.com")) {
          imagesList.push(imgUrl);
        } else {
          try {
            const uploadedUrl = await uploadUrlToCloudinary(imgUrl);
            imagesList.push(uploadedUrl);
          } catch (err) {
            console.warn(`Skipping invalid image link: ${err.message}`);
          }
        }
      } else if (typeof imgUrl === "string" && imgUrl.trim()) {
        imagesList.push(imgUrl);
      }
    }

    if (!thumbnailUrl && imagesList.length > 0) {
      thumbnailUrl = imagesList[0];
    }

    let features = [];
    if (typeof data.features === "string") {
      try {
        features = JSON.parse(data.features);
      } catch (e) {
        features = data.features
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(data.features)) {
      features = data.features;
    }

    let specifications = {};
    if (typeof data.specifications === "string") {
      try {
        specifications = JSON.parse(data.specifications);
      } catch (e) {
        specifications = {};
      }
    } else if (
      typeof data.specifications === "object" &&
      data.specifications !== null
    ) {
      specifications = data.specifications;
    }

    return await Product.create({
      title: data.title,
      description: data.description,
      price: Number(data.price),
      discountPercentage:
        data.discountPercentage !== undefined
          ? Number(data.discountPercentage)
          : 0,
      rating: data.rating !== undefined ? Number(data.rating) : 0,
      stock: Number(data.stock),
      brand: data.brand,
      category: data.category.toLowerCase(),
      thumbnail: thumbnailUrl,
      images: imagesList,
      features,
      specifications,
      createdBy: adminId,
    });
  }

  async getAllAdminProducts() {
    return await Product.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });
  }

  async getAdminProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("Invalid Product ID format");
    const product = await Product.findById(id).populate(
      "createdBy",
      "name email",
    );
    if (!product) throw new Error("Product not found");
    return product;
  }

  async updateProduct(id, data, files) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("Invalid Product ID format");
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    if (files) {
      if (files.thumbnail && files.thumbnail.length > 0) {
        product.thumbnail = await uploadBufferToCloudinary(
          files.thumbnail[0].buffer,
        );
      }
      if (files.images && files.images.length > 0) {
        for (const img of files.images) {
          const uploaded = await uploadBufferToCloudinary(img.buffer);
          product.images.push(uploaded);
        }
      }
    }

    if (data.title) product.title = data.title;
    if (data.description) product.description = data.description;
    if (data.price !== undefined) product.price = Number(data.price);
    if (data.discountPercentage !== undefined)
      product.discountPercentage = Number(data.discountPercentage);
    if (data.rating !== undefined) product.rating = Number(data.rating);
    if (data.stock !== undefined) product.stock = Number(data.stock);
    if (data.brand) product.brand = data.brand;
    if (data.category) product.category = data.category.toLowerCase();
    if (data.isActive !== undefined) product.isActive = data.isActive;

    if (data.features) {
      product.features =
        typeof data.features === "string"
          ? JSON.parse(data.features)
          : data.features;
    }
    if (data.specifications) {
      product.specifications =
        typeof data.specifications === "string"
          ? JSON.parse(data.specifications)
          : data.specifications;
    }

    if (data.thumbnail && (!files || !files.thumbnail)) {
      if (
        data.thumbnail.startsWith("http") &&
        !data.thumbnail.includes("res.cloudinary.com")
      ) {
        try {
          product.thumbnail = await uploadUrlToCloudinary(data.thumbnail);
        } catch (e) {
          product.thumbnail = data.thumbnail;
        }
      } else {
        product.thumbnail = data.thumbnail;
      }
    }

    await product.save();
    return product;
  }

  async deleteProduct(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("Invalid Product ID format");
    const product = await Product.findByIdAndDelete(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getCustomerProducts(query = {}) {
    const filter = { isActive: true };

    if (query.category) {
      filter.category = query.category.toLowerCase();
    }
    if (query.brand) {
      filter.brand = new RegExp(query.brand, "i");
    }
    if (query.search) {
      filter.$or = [
        { title: new RegExp(query.search, "i") },
        { description: new RegExp(query.search, "i") },
        { brand: new RegExp(query.search, "i") },
        { category: new RegExp(query.search, "i") },
      ];
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (query.sort) {
      if (query.sort === "price_asc") sortOptions = { price: 1 };
      else if (query.sort === "price_desc") sortOptions = { price: -1 };
      else if (query.sort === "rating_desc") sortOptions = { rating: -1 };
      else if (query.sort === "newest") sortOptions = { createdAt: -1 };
    }

    // Pagination
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    return {
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(id) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new Error("Invalid Product ID format");
    const product = await Product.findOne({ _id: id, isActive: true });
    if (!product) throw new Error("Product not found");
    return product;
  }

  async getAllCategories() {
    const categories = await Product.distinct("category", { isActive: true });
    return categories;
  }
}

module.exports = new ProductServices();
