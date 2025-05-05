const Driver = require('../models/driverModel');
const Team = require('../models/teamModel');
const Race = require('../models/raceModel');

const getDriverStandings = async (req, res) => {
  try {
    const drivers = await Driver.find()
      .select('name team seasonStats.points photoUrl')
      .populate('team', 'name logoUrl')
      .sort('-seasonStats.points');

    // Add position property to each driver
    const driversWithPosition = drivers.map((driver, index) => {
      const driverObj = driver.toObject();
      driverObj.position = index + 1;
      driverObj.points = driver.seasonStats.points; // Add points at top level for frontend
      return driverObj;
    });

    res.send(driversWithPosition);
  } catch (error) {
    res.status(500).send(error);
  }
};


const getTeamStandings = async (req, res) => {
  try {
    const teams = await Team.find()
      .select('name points logoUrl')  // Added logoUrl
      .sort('-points');
    
    // Add position property to each team
    const teamsWithPosition = teams.map((team, index) => {
      const teamObj = team.toObject();
      teamObj.position = index + 1;
      return teamObj;
    });
    
    res.send(teamsWithPosition);
  } catch (error) {
    res.status(500).send(error);
  }
};


// Points calculation system (same as in racesController)
const calculatePoints = (position) => {
  if (position === undefined || position === null) return 0;
  
  const pointsSystem = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
  };
  return pointsSystem[position] || 0;
};

// Reset and recalculate all standings
const recalculateAllStandings = async (req, res) => {
  try {
    // Reset all driver points to zero
    await Driver.updateMany({}, { 
      'seasonStats.points': 0,
      'seasonStats.podiums': 0,
      'seasonStats.wins': 0,
      'seasonStats.fastestLaps': 0,
      'seasonStats.starts': 0
    });
  // Add this to reset TEAM points:
  await Team.updateMany({}, { points: 0 });

    
    // Get all completed races
    const races = await Race.find({ status: 'completed' })
      .sort('date')
      .populate('results.driver');
    
    // Recalculate points from each race
    for (const race of races) {
      for (const result of race.results) {
        const isFastestLap = race.fastestLap && 
          race.fastestLap.toString() === result.driver._id.toString();
        const points = calculatePoints(result.position);
        
        const totalPoints = points ;
        
        // Inside the race loop, after calculating points
        await Driver.findByIdAndUpdate(
          result.driver._id,
          { 
            $inc: { 
              'seasonStats.points': totalPoints,
              'seasonStats.starts': 1,
              'seasonStats.wins': result.position === 1 ? 1 : 0,
              'seasonStats.podiums': result.position <= 3 ? 1 : 0,
              'seasonStats.fastestLaps': isFastestLap ? 1 : 0
            } 
          },
          { runValidators: true }
        );

    }
    }
    
    // Update team points (aggregate from drivers)

       const drivers = await Driver.find().populate('team');
      const teamPoints = {};
      drivers.forEach(driver => {
        if (driver.team) {
          const teamId = driver.team._id.toString();
          // Use seasonStats.points instead of direct points
          const driverPoints = driver.seasonStats?.points || 0;
          teamPoints[teamId] = (teamPoints[teamId] || 0) + driverPoints;
        }
      });

    for (const [teamId, points] of Object.entries(teamPoints)) {
      // Ensure points is a valid number
      const validPoints = isNaN(points) ? 0 : points;
      await Team.findByIdAndUpdate(
        teamId,
        { points: validPoints },
        { new: true }
      );
    }
    
    res.send({ message: 'All standings recalculated successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  getDriverStandings,
  getTeamStandings,
  recalculateAllStandings
};
