require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const { MONGODB_URI } = require('../utils/config');

async function createSuperAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ mobile: '+919999999999' });
    if (existing) {
      console.log('Super Admin already exists');
      process.exit();
    }

    const superAdmin = new User({
      name: 'Main Super Admin',
      mobile: '+919999999999',
      email: 'superadmin@example.com',
      role: 'superadmin',
      approved: true
    });

    await superAdmin.save();
    console.log('✅ Super Admin created successfully');
    process.exit();
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createSuperAdmin();
