const authorizeSelfOrAdmin = (req, res, next) => {
    if (req.user.role === 'admin' || req.user.id === req.params.id) {
        return next();
    }
    return res.status(403).json({ message: 'Forbidden' });
};

module.exports = authorizeSelfOrAdmin;
