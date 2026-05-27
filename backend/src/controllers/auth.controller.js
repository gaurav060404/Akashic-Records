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

    // Include user data in the redirect
    const userData = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar || req.user.picture // Google might use 'picture' field
    };

    res.redirect(`${process.env.FRONTEND_URL}?token=${token}&user=${encodeURIComponent(JSON.stringify(userData))}`);
};

export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

// Get user's watchlist
export const getWatchlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ watchlist: user.watchlist || [] });
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add/remove item from watchlist
export const toggleWatchlistItem = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = req.body;
    if (!user.watchlist) user.watchlist = [];

    console.log(user.watchlist);

    const itemIndex = user.watchlist.findIndex(w => w.id === item.id);

    if (itemIndex > -1) {
      user.watchlist.splice(itemIndex, 1);
      var message = "Item removed from watchlist";
    } else {
      user.watchlist.push(item);
      var message = "Item added to watchlist";
    }

    await user.save();
    res.status(200).json({
      message,
      watchlist: user.watchlist,
      isInWatchlist: itemIndex === -1
    });
  } catch (error) {
    console.error("Error updating watchlist:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};