
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const ROLES = require('../config/roles');

const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) return res.status(401).send({ error: 'Invalid credentials' }); 
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).send({ error: 'Invalid credentials' }); 
 
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '3h' }
        );
        
        res.send({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ error: error.message });
      }
};


const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            const message = existingUser.email === email 
                ? 'Email already exists' 
                : 'Username already exists';
            return res.status(400).send({ error: message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword,
            role: ROLES.USER 
        });

        await user.save();

        res.status(201).send({ 
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error); 
        res.status(500).send({ error: error.message });
      }
};



module.exports = { login, register };
