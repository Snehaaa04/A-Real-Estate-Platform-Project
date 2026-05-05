import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Property } from './models/Property';
import { User } from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const cities = ['Mumbai', 'Delhi', 'Pune', 'Bangalore', 'Hyderabad', 'Gurgaon', 'Jaipur', 'Kolkata', 'Chennai', 'Noida'];

const dummyProperties = [
  {
    title: 'Luxury Apartment in Bandra',
    description: 'A beautiful sea-facing apartment in the heart of Bandra. Features modern amenities and secure parking.',
    location: 'Bandra West',
    city: 'Mumbai',
    price: 35000000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 1800,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 32000000,
      registrationFee: 350000,
      stampDuty: 1920000,
      gst: 150000,
      maintenanceFee: 120000,
      brokerageFee: 320000,
      otherCharges: 140000,
      totalEstimatedPrice: 35000000
    },
    propertyHistory: [
      { previousPrice: 28000000, previousOwner: 'Rahul Desai', statusChange: 'sold', changeDate: new Date('2021-05-12'), note: 'Purchased directly from builder' }
    ],
    areaRealityIndex: {
      city: 'Mumbai',
      areaName: 'Bandra West',
      safetyScore: 9.2,
      connectivityScore: 9.5,
      amenitiesScore: 9.8,
      pollutionScore: 6.5,
      averageRating: 8.7,
      summary: 'Premium location with excellent connectivity and lifestyle amenities, though traffic can be dense during peak hours.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: true,
      verifiedAt: new Date()
    },
    transparencyScore: 95,
    dealerTransparencyScore: 92
  },
  {
    title: 'Modern Villa in DLF Phase 5',
    description: 'Spacious independent villa with private garden, smart home features, and premium Italian marble flooring.',
    location: 'DLF Phase 5',
    city: 'Gurgaon',
    price: 45000000,
    propertyType: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    areaSqft: 4500,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 42000000,
      registrationFee: 400000,
      stampDuty: 2100000,
      gst: 0, // Resale
      maintenanceFee: 80000,
      brokerageFee: 420000,
      otherCharges: 0,
      totalEstimatedPrice: 45000000
    },
    propertyHistory: [
      { previousPrice: 38000000, previousOwner: 'Sanjay Kumar', statusChange: 'sold', changeDate: new Date('2019-11-20'), note: 'Resale' }
    ],
    areaRealityIndex: {
      city: 'Gurgaon',
      areaName: 'DLF Phase 5',
      safetyScore: 8.5,
      connectivityScore: 9.0,
      amenitiesScore: 9.5,
      pollutionScore: 5.0,
      averageRating: 8.0,
      summary: 'High-end residential sector with top corporate parks nearby. Pollution levels are a concern in winter.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: true,
      verifiedAt: new Date()
    },
    transparencyScore: 88,
    dealerTransparencyScore: 85
  },
  {
    title: 'Penthouse with City View',
    description: 'Extravagant penthouse located in the prime IT corridor with 360-degree views of the city skyline.',
    location: 'Whitefield',
    city: 'Bangalore',
    price: 28000000,
    propertyType: 'penthouse',
    bedrooms: 4,
    bathrooms: 4,
    areaSqft: 3200,
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 25000000,
      registrationFee: 250000,
      stampDuty: 1400000,
      gst: 1000000,
      maintenanceFee: 150000,
      brokerageFee: 0,
      otherCharges: 200000,
      totalEstimatedPrice: 28000000
    },
    propertyHistory: [],
    areaRealityIndex: {
      city: 'Bangalore',
      areaName: 'Whitefield',
      safetyScore: 8.8,
      connectivityScore: 7.5,
      amenitiesScore: 9.0,
      pollutionScore: 7.0,
      averageRating: 8.0,
      summary: 'IT hub with great communities. Traffic congestion and water supply issues are ongoing challenges.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: false,
      verifiedAt: new Date()
    },
    transparencyScore: 82,
    dealerTransparencyScore: 90
  },
  {
    title: 'Cozy 2BHK near Metro',
    description: 'Perfect for small families or working professionals. 5 minutes walk from the nearest metro station.',
    location: 'Kothrud',
    city: 'Pune',
    price: 8500000,
    propertyType: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    areaSqft: 1100,
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 7800000,
      registrationFee: 78000,
      stampDuty: 468000,
      gst: 0,
      maintenanceFee: 54000,
      brokerageFee: 100000,
      otherCharges: 0,
      totalEstimatedPrice: 8500000
    },
    propertyHistory: [
      { previousPrice: 6500000, previousOwner: 'Amit Joshi', statusChange: 'sold', changeDate: new Date('2018-02-15'), note: 'First owner' }
    ],
    areaRealityIndex: {
      city: 'Pune',
      areaName: 'Kothrud',
      safetyScore: 9.5,
      connectivityScore: 8.5,
      amenitiesScore: 8.5,
      pollutionScore: 8.0,
      averageRating: 8.6,
      summary: 'Established residential neighborhood, very safe, with good schools and cultural heritage.'
    },
    verification: {
      isVerified: false,
      documentsVerified: false,
      ownershipVerified: false,
      priceVerified: false
    },
    transparencyScore: 65,
    dealerTransparencyScore: 70
  },
  {
    title: 'Sea View Studio',
    description: 'Compact and modern studio apartment overlooking the Bay of Bengal.',
    location: 'ECR',
    city: 'Chennai',
    price: 6000000,
    propertyType: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    areaSqft: 650,
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2071&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 5500000,
      registrationFee: 55000,
      stampDuty: 385000,
      gst: 0,
      maintenanceFee: 60000,
      brokerageFee: 0,
      otherCharges: 0,
      totalEstimatedPrice: 6000000
    },
    propertyHistory: [],
    areaRealityIndex: {
      city: 'Chennai',
      areaName: 'ECR',
      safetyScore: 8.0,
      connectivityScore: 8.0,
      amenitiesScore: 8.5,
      pollutionScore: 9.0,
      averageRating: 8.3,
      summary: 'Scenic and less polluted area. Great for weekend homes or peaceful living, slightly far from city center.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: true,
      verifiedAt: new Date()
    },
    transparencyScore: 90,
    dealerTransparencyScore: 88
  },
  {
    title: 'Heritage Bungalow',
    description: 'Restored heritage property with vintage architecture and a massive courtyard.',
    location: 'Ballygunge',
    city: 'Kolkata',
    price: 55000000,
    propertyType: 'house',
    bedrooms: 6,
    bathrooms: 5,
    areaSqft: 6000,
    images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 50000000,
      registrationFee: 500000,
      stampDuty: 3500000,
      gst: 0,
      maintenanceFee: 200000,
      brokerageFee: 500000,
      otherCharges: 300000, // Renovation fund
      totalEstimatedPrice: 55000000
    },
    propertyHistory: [
      { previousPrice: 30000000, previousOwner: 'S. Chatterjee', statusChange: 'sold', changeDate: new Date('2010-08-11'), note: 'Family inherited property' },
      { previousPrice: 42000000, previousOwner: 'A. Roy', statusChange: 'sold', changeDate: new Date('2017-03-22'), note: 'Restored before selling' }
    ],
    areaRealityIndex: {
      city: 'Kolkata',
      areaName: 'Ballygunge',
      safetyScore: 9.0,
      connectivityScore: 9.5,
      amenitiesScore: 9.0,
      pollutionScore: 6.5,
      averageRating: 8.5,
      summary: 'Posh, upscale neighborhood with excellent cafes, schools, and cultural spots.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: false,
      verifiedAt: new Date()
    },
    transparencyScore: 85,
    dealerTransparencyScore: 95
  },
  {
    title: 'Premium Flat in Hi-Tech City',
    description: 'Fully furnished 3BHK flat located in the IT hub. Ready to move in.',
    location: 'Hi-Tech City',
    city: 'Hyderabad',
    price: 18000000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    areaSqft: 2000,
    images: ['https://images.unsplash.com/photo-1502672260266-1c1de2d9d00c?q=80&w=1980&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 16000000,
      registrationFee: 160000,
      stampDuty: 1200000,
      gst: 0,
      maintenanceFee: 140000,
      brokerageFee: 300000,
      otherCharges: 200000,
      totalEstimatedPrice: 18000000
    },
    propertyHistory: [],
    areaRealityIndex: {
      city: 'Hyderabad',
      areaName: 'Hi-Tech City',
      safetyScore: 9.0,
      connectivityScore: 9.2,
      amenitiesScore: 9.5,
      pollutionScore: 7.5,
      averageRating: 8.8,
      summary: 'Vibrant IT corridor, highly safe, with all modern amenities. Can get crowded.'
    },
    verification: {
      isVerified: true,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: true,
      verifiedAt: new Date()
    },
    transparencyScore: 92,
    dealerTransparencyScore: 89
  },
  {
    title: 'Golf Course Extension Apartment',
    description: 'Newly built high-rise apartment with view of the golf course.',
    location: 'Sector 55',
    city: 'Noida',
    price: 12500000,
    propertyType: 'apartment',
    bedrooms: 3,
    bathrooms: 2,
    areaSqft: 1650,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop'],
    priceBreakdown: {
      basePrice: 11000000,
      registrationFee: 110000,
      stampDuty: 770000,
      gst: 440000,
      maintenanceFee: 80000,
      brokerageFee: 100000,
      otherCharges: 0,
      totalEstimatedPrice: 12500000
    },
    propertyHistory: [],
    areaRealityIndex: {
      city: 'Noida',
      areaName: 'Sector 55',
      safetyScore: 8.0,
      connectivityScore: 8.5,
      amenitiesScore: 8.0,
      pollutionScore: 5.5,
      averageRating: 7.5,
      summary: 'Developing area with great potential, good infrastructure, but pollution is high.'
    },
    verification: {
      isVerified: false,
      documentsVerified: true,
      ownershipVerified: true,
      priceVerified: false
    },
    transparencyScore: 75,
    dealerTransparencyScore: 80
  }
];

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/clear_estate');
    console.log('Connected to MongoDB');

    // Clear existing properties
    await Property.deleteMany({});
    console.log('Cleared existing properties');

    // Create dummy users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Dummy Seller 1
    let seller1 = await User.findOne({ email: 'seller1@demo.com', role: 'seller' });
    if (!seller1) {
      seller1 = await User.create({
        name: 'Prime Realty (Demo)',
        email: 'seller1@demo.com',
        password: hashedPassword,
        role: 'seller',
        dealerData: {
          transparencyScore: 95,
          successfulDeals: 142,
          complaints: 1,
          responseRate: 98,
          verifiedListings: 45,
          totalListings: 48,
          averageRating: 4.8
        }
      });
    }

    // Dummy Seller 2
    let seller2 = await User.findOne({ email: 'seller2@demo.com', role: 'seller' });
    if (!seller2) {
      seller2 = await User.create({
        name: 'Apex Properties (Demo)',
        email: 'seller2@demo.com',
        password: hashedPassword,
        role: 'seller',
        dealerData: {
          transparencyScore: 88,
          successfulDeals: 67,
          complaints: 3,
          responseRate: 85,
          verifiedListings: 12,
          totalListings: 15,
          averageRating: 4.2
        }
      });
    }

    // Assign sellers to properties alternately
    const sellers = [seller1._id, seller2._id];
    
    for (let i = 0; i < dummyProperties.length; i++) {
      const property = {
        ...dummyProperties[i],
        sellerId: sellers[i % sellers.length]
      };
      await Property.create(property);
    }

    console.log(`Successfully seeded ${dummyProperties.length} properties!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
