const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const testDbConnection = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || mongoUri.includes("<db_password>") || mongoUri.includes("YOUR_PASSWORD")) {
    throw new Error("Set a real MongoDB Atlas MONGO_URI in server/.env first.");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected successfully.");
  console.log(`Database: ${mongoose.connection.name}`);
  await mongoose.disconnect();
};

testDbConnection().catch(async (error) => {
  console.error("MongoDB connection failed:");
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
