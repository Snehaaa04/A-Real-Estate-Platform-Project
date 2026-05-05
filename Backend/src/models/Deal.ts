import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['buyer', 'seller'], required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected', 'countered'], default: 'pending' },
  note: { type: String }
}, { timestamps: true });

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['buyer', 'seller'], required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const dealSchema = new mongoose.Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'accepted', 'rejected', 'closed'], default: 'active' },
  offers: [offerSchema],
  messages: [messageSchema]
}, { timestamps: true });

export const Deal = mongoose.model('Deal', dealSchema);
