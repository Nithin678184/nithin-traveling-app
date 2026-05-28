const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL || "admin@nithintraveling.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  let admin = await User.findOne({ email });

  if (!admin) {
    admin = await User.create({
      name: "Nithin Travels Admin",
      email,
      phone: "9876543210",
      password,
      role: "admin"
    });
    console.log(`Admin created: ${email} / ${password}`);
  } else {
    admin.role = "admin";
    admin.password = password;
    admin.name = admin.name || "Nithin Travels Admin";
    admin.phone = admin.phone || "9876543210";
    await admin.save();
    console.log(`Admin updated: ${email} / ${password}`);
  }

  await mongoose.disconnect();
};

seedAdmin().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
