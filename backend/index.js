import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './src/authRoutes.js';
import { googleConfig } from './src/config/oauthConfig.js';
import User from './src/models/userModel.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(passport.initialize());

passport.use(
  new GoogleStrategy(googleConfig, async (accessToken, refreshToken, profile, done) => {
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
  })
);

app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});
