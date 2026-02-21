const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { 
    type: String, 
    default: 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
  },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: false },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'admin', 'moderator'], 
    default: 'customer' 
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: null }
});

module.exports = mongoose.model('User', userSchema);