
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AdminProfile = require('../models/AdminProfile');

exports.registerAdmin = async (req, res) => {
  try {
    const data = req.body;

    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      return res.status(400).json({ error: "Password is required" });
    }

    const newAdmin = new AdminProfile({
      full_name: data.full_name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      designation: data.designation,
      department: data.department,
      contact_office: data.contact_office,
      college: data.college,
      admin_level: data.admin_level || "admin",
      permissions: data.permissions || { edit_user: false, manage_events: false },
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
};

exports.loginAdmin = async (req, res) => {
  console.log('Admin login route hit');
  const { email, password } = req.body;

  try {
    const user = await AdminProfile.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({
      token,
      user: { id: user._id, full_name: user.full_name, email: user.email },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
