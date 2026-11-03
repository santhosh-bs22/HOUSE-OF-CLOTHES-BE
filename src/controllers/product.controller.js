const productServices = require("../services/product.services.js");

class ProductController {
  /**
   * POST /api/admin/products
   * Admin: Add new product (saves images to Cloudinary)
   */
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

      const product = await productServices.createProduct(
        req.body,
        req.files,
        adminId
      );

      return res.status(201).json({
        success: true,
        message: "Product created successfully with Cloudinary images",
        data: product
      });
    } catch (error) {
      console.error("Create product error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/products
   * Customer fetch: only active products
   */
  async getCustomerProducts(req, res) {
    try {
      const products = await productServices.getCustomerProducts(req.query);
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully for customer",
        count: products.length,
        data: products
      });
    } catch (error) {
      console.error("Fetch products error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/products/:id
   * Customer fetch single product
   */
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
      console.error("Fetch product by ID error:", error.message);
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * GET /api/admin/products
   * Admin fetch all products
   */
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
      console.error("Admin fetch products error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * PUT /api/admin/products/:id
   * Admin update product
   */
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
      console.error("Update product error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * DELETE /api/admin/products/:id
   * Admin delete product
   */
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
      console.error("Delete product error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();
