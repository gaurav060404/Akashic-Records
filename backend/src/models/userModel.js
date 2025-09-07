import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String
  },
  name: {
    type: String,
    required: true
  },
  googleId: {
    type: String
  },
  avatar: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  watchlist: [
    {
      id: String,
      posterName: String,
      title: String,
      posterPath: String,
      backDropPath: String,
      overview: String,
      rating: mongoose.Schema.Types.Mixed,
      releaseDate: String,
      genres: Array,
      type: String,
      trailer: String,
      credits: Array,
      isAnime: Boolean
    }
  ],
});

userSchema.pre('save', async function(next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);