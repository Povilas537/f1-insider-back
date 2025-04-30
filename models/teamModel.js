const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  logoUrl:    { type: String },
  country:    { type: String },
  foundation: { type: Date },
  points:     { type: Number, default: 0 },
  drivers:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }] // <-- Add this line
});

module.exports = mongoose.model('Team', teamSchema);
