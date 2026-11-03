const express = require("express");
const dotenv = require("dotenv");
const connection = require("./src/config/dbconfig.js");
const cors = require("cors");
const authRoutes = require("./src/routes/auth.routes.js");
const productRoutes = require("./src/routes/product.routes.js");
const categoryRoutes = require("./src/routes/category.routes.js");
const cartRoutes = require("./src/routes/cart.routes.js");
const wishlistRoutes = require("./src/routes/wishlist.routes.js");
const orderRoutes = require("./src/routes/order.routes.js");
const userRoutes = require("./src/routes/user.routes.js");
const adminRoutes = require("./src/routes/admin.routes.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

const port = process.env.PORT || 5000;

connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start server due to DB connection error : ",
      error.message,
    );
    process.exit(1);
  });
