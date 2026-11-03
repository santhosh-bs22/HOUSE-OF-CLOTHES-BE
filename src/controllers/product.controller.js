const productServices = require("../services/product.services.js");

class ProductController {
  // Admin: create product
  async createProduct(req, res) {
    try {
      const { title, description, price, stock, brand, category } = req.body;
      if (!title || !description || price === undefined || stock === undefined || !brand || !category) {
        return res.status(400).json({
          success: false,
          message: "Required fields missing: title, description, price, stock, brand, category are mandatory"
        });
      }

      const adminId = req.user.id;
      const product = await productServices.createProduct(req.body, req.files, adminId);

      return res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
      });
    } catch (error) {
      console.error("Create product error:", error.message);
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: get all products
  async getAllAdminProducts(req, res) {
    try {
      const products = await productServices.getAllAdminProducts();
      return res.status(200).json({
        success: true,
        message: "Admin products fetched successfully",
        count: products.length,
        data: products
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Admin: get single product
  async getAdminProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productServices.getAdminProductById(id);
      return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product
      });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // Admin: update product
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      const updated = await productServices.updateProduct(id, req.body, req.files);
      return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: updated
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Admin: delete product
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deleted = await productServices.deleteProduct(id);
      return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: deleted
      });
    } catch (error) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  // Customer: get products (with search, category, sort, page, limit)
  async getCustomerProducts(req, res) {
    try {
      const result = await productServices.getCustomerProducts(req.query);
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        ...result
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Customer: get product details by ID
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productServices.getProductById(id);
      return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        data: product
      });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  // Customer: get distinct categories
  async getCategories(req, res) {
    try {
      const categories = await productServices.getAllCategories();
      return res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        data: categories
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new ProductController();
