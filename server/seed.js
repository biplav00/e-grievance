const mongoose = require("mongoose");
const Department = require("./models/Department");
require("dotenv").config();

const departments = [{ name: "Public Works" }, { name: "Water Dept" }, { name: "Electricity Dept" }];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Department.deleteMany({});
  await Department.insertMany(departments);
  mongoose.connection.close();
};

seedDB().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
