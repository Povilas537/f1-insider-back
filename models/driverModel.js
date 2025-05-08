const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  nationality: { type: String },
  photoUrl: { type: String },
  number: { type: Number },
  dateOfBirth: { type: String },
  biography: { type: String },
  careerStart: { type: Number },
  gallery: [{ type: String }],
 
  careerStats: {
    starts: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    podiums: { type: Number, default: 0, min: 0 },
    fastestLaps: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 }
  },

  seasonStats: {
    starts: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    podiums: { type: Number, default: 0, min: 0 },
    fastestLaps: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 }
  },
 
  initialCareerStats: {
    starts: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    podiums: { type: Number, default: 0 },
    fastestLaps: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }
});


module.exports = mongoose.model('Driver', driverSchema);
