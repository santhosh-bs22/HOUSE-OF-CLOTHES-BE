const mongoose = require("mongoose");

const connection = async () => {
  const mongoDb = process.env.MONGO_URI;
  if (!mongoDb) {
    console.error("Error: No MONGO_URI in your environment");
    process.exit(1);
  }
  try {
    await mongoose.connect(mongoDb);
    console.log("MongoDb was successfully Connected");
  } catch (error) {
    console.error("Error connecting to mongoDb: ", error.message);
    process.exit(1);
  }
};

module.exports = connection;