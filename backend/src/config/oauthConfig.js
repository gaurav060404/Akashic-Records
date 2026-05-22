import dotenv from 'dotenv';
dotenv.config();

export const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
};

export const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '7d'
};