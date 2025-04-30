const mongoose = require('mongoose');
const ROLES = require('../config/roles'); 

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: [ROLES.ADMIN, ROLES.USER, ROLES.MODERATOR], default: ROLES.USER },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
