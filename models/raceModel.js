const mongoose = require('mongoose');
const Driver = require('./driverModel'); // Assuming you have a driver model


const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  circuit: { type: String },
  country: { type: String },
  status: { type: String, enum: ['upcoming', 'completed'], default: 'upcoming' },
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  fastestLap: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  results: [{
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
    position: Number,
    points: Number,
    finishStatus: { type: String, default: 'Finished' } // DNF, DSQ, etc.
  }]
});

module.exports = mongoose.model('Race', raceSchema);
