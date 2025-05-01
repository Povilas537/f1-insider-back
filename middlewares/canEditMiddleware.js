
const authorizeSelfOrAdmin = (req, res, next) => {
    // Compare using 'id' from token
    const isOwner = req.comment.user.toString() === req.user.id;
    
    if (req.user.role === 'admin' || isOwner) {
      return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
  };
  
  module.exports = authorizeSelfOrAdmin;