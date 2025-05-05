const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  logoUrl:     { type: String },
  country:     { type: String },
  foundation:  { type: Date },
  points:      { type: Number, default: 0 },
  drivers:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
  description: { type: String },
  carModel:    { type: String },
  teamPrincipal: { type: String },
  gallery:     [{ type: String }],  // Array of image URLs
  
  // New team history fields
  fullName:    { type: String },
  base:        { type: String },
  teamChief:   { type: String },  // Can use this instead of teamPrincipal if you prefer
  technicalChief: { type: String },
  chassis:     { type: String },  // Can use this instead of carModel if you prefer
  powerUnit:   { type: String },
  firstEntry:  { type: Number },  // Year of first F1 entry
  worldChampionships: { type: Number, default: 0 },

}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
