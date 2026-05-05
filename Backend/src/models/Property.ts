import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  id: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  price: { type: Number, required: true },
  propertyType: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSqft: { type: Number, required: true },
  images: [{ type: String }],
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['available', 'pending', 'sold'], default: 'available' },
  
  // Transparency Features
  priceBreakdown: {
    basePrice: { type: Number, default: 0 },
    registrationFee: { type: Number, default: 0 },
    stampDuty: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    maintenanceFee: { type: Number, default: 0 },
    brokerageFee: { type: Number, default: 0 },
    otherCharges: { type: Number, default: 0 },
    totalEstimatedPrice: { type: Number, default: 0 }
  },
  propertyHistory: [{
    previousPrice: { type: Number },
    previousOwner: { type: String },
    statusChange: { type: String },
    changeDate: { type: Date },
    note: { type: String }
  }],
  areaRealityIndex: {
    city: { type: String },
    areaName: { type: String },
    safetyScore: { type: Number, default: 0 },
    connectivityScore: { type: Number, default: 0 },
    amenitiesScore: { type: Number, default: 0 },
    pollutionScore: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    summary: { type: String }
  },
  verification: {
    isVerified: { type: Boolean, default: false },
    documentsVerified: { type: Boolean, default: false },
    ownershipVerified: { type: Boolean, default: false },
    priceVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date }
  },
  transparencyScore: { type: Number, default: 0 },
  dealerTransparencyScore: { type: Number, default: 0 },
  
  // Sold Metadata
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldAt: { type: Date },
  finalSoldPrice: { type: Number },
  acceptedDealId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deal' }
}, {
  timestamps: true
});

export const Property = mongoose.model('Property', propertySchema);
