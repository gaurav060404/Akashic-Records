import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { jwtConfig } from '../config/oauthConfig.js';

export const signup = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            email,
            password,
            name
        });

        const token = jwt.sign({ id: user._id }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn
        });

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, jwtConfig.secret, {
            expiresIn: jwtConfig.expiresIn
        });

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                avatar: user.avatar
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

export const logout = (req, res) => {
    res.json({ message: 'Logged out successfully' });
};

export const googleCallback = (req, res) => {
    const token = jwt.sign({ id: req.user._id }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
    });

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}`);
};