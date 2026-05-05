import mongoose from 'mongoose';

const requestSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'rent'], required: true },
  message: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
}, { timestamps: true });

export const RequestModel = mongoose.model('Request', requestSchema);
