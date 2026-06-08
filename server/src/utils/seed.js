require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const exists = await User.findOne({ userId: "ADM-001" });
  if (exists) {
    console.log("Admin already exists. Skipping.");
    process.exit(0);
  }

  await User.create({
    userId: "ADM-001",
    name: "Super Admin",
    password: "admin123", // change immediately after first login
    role: "admin",
  });

  console.log("✅ Admin seeded: userId=ADM-001 / password=admin123");
  process.exit(0);
};

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
