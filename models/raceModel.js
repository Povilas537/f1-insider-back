const mongoose = require('mongoose');
const Driver = require('./driverModel'); // Assuming you have a driver model


const raceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  circuit: { type: String, required: true },
  country: { type: String },
  status: { 
    type: String, 
    enum: ['upcoming', 'completed'], 
    default: 'upcoming' 
  },
  imageUrl: { type: String }, // Add this new field
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  fastestLap: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  results: [{
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    position: { type: Number, required: true },
    points: { type: Number, default: 0 }
  }]
});

module.exports = mongoose.model('Race', raceSchema);
