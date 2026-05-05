import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  dealerData: {
    transparencyScore: { type: Number, default: 0 },
    successfulDeals: { type: Number, default: 0 },
    complaints: { type: Number, default: 0 },
    responseRate: { type: Number, default: 0 },
    verifiedListings: { type: Number, default: 0 },
    totalListings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1, role: 1 }, { unique: true });
userSchema.index({ phoneNumber: 1, role: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
