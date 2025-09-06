import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { googleConfig } from './src/config/oauthConfig.js';
import authRoutes from './src/authRoutes.js';
import User from './src/models/userModel.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Passport Google Strategy
passport.use(new GoogleStrategy(googleConfig,
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      
      if (!user) {
        user = await User.create({
          email: profile.emails[0].value,
          name: profile.displayName,
          googleId: profile.id,
          avatar: profile.photos[0].value
        });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Routes
app.use('/auth', authRoutes);

export default app;