const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  date:      { type: Date, required: true },
  circuit:   { type: String },
  winner:    { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  results:   [{ driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, position: Number }]
});

module.exports = mongoose.model('Race', raceSchema);
