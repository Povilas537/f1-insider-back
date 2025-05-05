// scripts/dataCleanup.js

const mongoose = require('mongoose');
const Driver = require('./models/driverModel');
const Team = require('./models/teamModel');

// MongoDB connection
mongoose.connect('mongodb+srv://povilas537:Idriveboats537@cluster1.6utjw3s.mongodb.net/f1-insider?retryWrites=true&w=majority&appName=Cluster1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

async function cleanupDriverData() {
  console.log('Starting driver data cleanup...');
  
  try {
    // Get all drivers
    const drivers = await Driver.find();
    let fixedCount = 0;
    
    for (const driver of drivers) {
      let needsUpdate = false;
      
      // Fix negative values in careerStats
      if (driver.careerStats.points < 0) {
        driver.careerStats.points = 0;
        needsUpdate = true;
      }
      if (driver.careerStats.podiums < 0) {
        driver.careerStats.podiums = 0;
        needsUpdate = true;
      }
      if (driver.careerStats.starts < 0) {
        driver.careerStats.starts = 0;
        needsUpdate = true;
      }
      
      // Fix negative values in seasonStats
      if (driver.seasonStats.points < 0) {
        driver.seasonStats.points = 0;
        needsUpdate = true;
      }
      if (driver.seasonStats.podiums < 0) {
        driver.seasonStats.podiums = 0;
        needsUpdate = true;
      }
      if (driver.seasonStats.starts < 0) {
        driver.seasonStats.starts = 0;
        needsUpdate = true;
      }
      
      // Remove top-level stats fields if they exist
      // (these should only be in the nested objects)
      if (driver.points !== undefined) {
        driver.set('points', undefined);
        needsUpdate = true;
      }
      if (driver.podiums !== undefined) {
        driver.set('podiums', undefined);
        needsUpdate = true;
      }
      if (driver.wins !== undefined) {
        driver.set('wins', undefined);
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await driver.save();
        fixedCount++;
        console.log(`Fixed driver: ${driver.name}`);
      }
    }
    
    console.log(`Cleanup completed. Fixed ${fixedCount} drivers.`);
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Execute the cleanup
cleanupDriverData();
