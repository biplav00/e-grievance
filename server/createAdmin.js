const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const adminEmail = 'admin@gov.com';
  const adminPassword = 'password123';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    console.log('Admin user already exists.');
    mongoose.connection.close();
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(adminPassword, salt);
  const adminUser = new User({ email: adminEmail, password: hashedPassword, role: 'admin' });
  await adminUser.save();
  console.log('Admin user created successfully!');
  console.log(`Email: ${adminEmail}`);
  console.log(`Password: ${adminPassword}`);
  mongoose.connection.close();
};
createAdmin();