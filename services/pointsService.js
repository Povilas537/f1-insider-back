
const POINTS_SYSTEM = {
    1: 25,
    2: 18,
    3: 15,
    4: 12,
    5: 10,
    6: 8,
    7: 6,
    8: 4,
    9: 2,
    10: 1
  };
  

  
const calculateDriverPoints = (position) => {
  return POINTS_SYSTEM[position] || 0;
};
  module.exports = {
    calculateDriverPoints,
    POINTS_SYSTEM
  };
  