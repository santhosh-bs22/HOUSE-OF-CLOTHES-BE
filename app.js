const express = require("express");
const dotenv = require("dotenv");
const connection = require("./src/config/dbconfig.js");
const cors = require("cors");
const adminRoutes = require("./src/routes/admin.routes.js");
const productRoutes = require("./src/routes/product.routes.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);

const port = process.env.PORT || 3000;

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
