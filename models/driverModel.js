const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  team:        { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  nationality: { type: String },
  photoUrl:    { type: String },
  dateOfBirth: { type: Date },
  points:      { type: Number, default: 0 }
});

module.exports = mongoose.model('Driver', driverSchema);
