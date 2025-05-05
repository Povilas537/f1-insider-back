const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  nationality: { type: String },
  photoUrl: { type: String },
  
  // Career stats (lifetime totals)
  careerStats: {
    starts: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    podiums: { type: Number, default: 0, min: 0 },
    fastestLaps: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 }
  },
  
  // Season stats (unchanged)
  seasonStats: {
    starts: { type: Number, default: 0, min: 0 },
    wins: { type: Number, default: 0, min: 0 },
    podiums: { type: Number, default: 0, min: 0 },
    fastestLaps: { type: Number, default: 0, min: 0 },
    points: { type: Number, default: 0, min: 0 }
  },
  
  // NEW: Initial career stats for reset functionality
  initialCareerStats: {
    starts: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    podiums: { type: Number, default: 0 },
    fastestLaps: { type: Number, default: 0 },
    points: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('Driver', driverSchema);
