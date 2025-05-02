const ROLES = require('../config/roles');
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        res.send(users)
    } catch (error) {
        res.status(500).send(error)
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password')
        if (!user) {
            return res.status(404).send({ error: 'User not found' })
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
}

const createUser = async (req, res) => {
    try {
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const userData = {...req.body, password: hashedPassword};
        
        const user = new User(userData);
        await user.save();
        const userResponse = user.toObject();
        delete userResponse.password;
        res.send(userResponse);
    } catch (error) {
        res.status(500).send(error);
    }
}
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {...req.body};
        
        // Hash password if it's being updated
        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            id,
            updates,
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send(error);
    }
}


const deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        const deletedUser = await User.findByIdAndDelete(id)
        if (!deletedUser) {
            return res.status(404).send({ error: 'User not found' })
        }
        res.send({ message: 'User was removed', data: { id: deletedUser._id } })
    } catch (error) {
        res.status(500).send(error)
    }
}

const changeUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (!Object.values(ROLES).includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ message: 'Role updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Role change failed', error: error.message });
    }
  };

  // controllers/usersController.js
// controllers/usersController.js
const subscribeToNewsletter = async (req, res) => {
    try {
      // Update user role
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { role: 'subscriber' },
        { new: true }
      ).select('-password');
      
      // Generate a new token with updated role
      const token = jwt.sign(
        { id: updatedUser._id, role: 'subscriber' },
        process.env.JWT_SECRET,
        { expiresIn: '3h' }
      );
      
      res.status(200).json({ 
        message: 'Successfully subscribed to newsletter',
        user: updatedUser,
        token: token // Send new token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  
module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    changeUserRole,
    subscribeToNewsletter
}
