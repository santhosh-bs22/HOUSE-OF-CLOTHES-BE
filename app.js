const express = require("express");
const dotenv = require("dotenv");
const connection = require("./src/config/dbconfig.js");
const cors = require("cors")
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }))

const port = process.env.PORT || 5000;

connection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error(
      "Failed to start server due to DB cnnection error : ",
      error.message,
    );
    process.exit(1);
  });