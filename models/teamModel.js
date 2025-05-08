const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  logoUrl:     { type: String },
  
  
  points:      { type: Number, default: 0 },
  drivers:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }],
  description: { type: String },

  teamPrincipal: { type: String },
  gallery:     [{ type: String }], 
  

  fullName:    { type: String },
  base:        { type: String },

  technicalChief: { type: String },
  chassis:     { type: String },  
  powerUnit:   { type: String },
  firstEntry:  { type: Number },  
  worldChampionships: { type: Number, default: 0 },

}, {
  timestamps: true
});

module.exports = mongoose.model('Team', teamSchema);
