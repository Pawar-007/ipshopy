import mongoose from 'mongoose';

const googleUserSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true, // ensures one user per Google account
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String, 
    },
    refreshToken: {
      type: String, 
    },
  },
  { timestamps: true } // automatically adds createdAt and updatedAt
);

const GoogleUser = mongoose.model('GoogleUser', googleUserSchema);

export default GoogleUser;
