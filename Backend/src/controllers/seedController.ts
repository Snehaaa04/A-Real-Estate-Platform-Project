import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Deal } from '../models/Deal';

export const seedDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Property.deleteMany({});
    await Deal.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    // Create Demo Users
    const buyer = await User.create({
      name: 'Demo Buyer',
      email: 'buyer@example.com',
      password,
      role: 'buyer',
      savedProperties: []
    });

    const seller = await User.create({
      name: 'Demo Seller',
      email: 'seller@example.com',
      password,
      role: 'seller',
      savedProperties: []
    });

    // Create Demo Properties
    const properties = [
      {
        title: 'Modern 3BHK Apartment in Mumbai',
        description: 'Spacious and modern apartment with sea view in Bandra.',
        location: 'Bandra West',
        address: '101 Sea Breeze Apts, Carter Road',
        city: 'Mumbai',
        price: 35000000,
        propertyType: 'apartment',
        bedrooms: 3,
        bathrooms: 3,
        areaSqft: 1800,
        images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500'],
        sellerId: seller._id,
        status: 'available'
      },
      {
        title: 'Luxury Villa in Pune',
        description: 'A beautiful luxury villa with a private pool and garden.',
        location: 'Koregaon Park',
        address: 'Plot 45, North Main Road',
        city: 'Pune',
        price: 55000000,
        propertyType: 'villa',
        bedrooms: 5,
        bathrooms: 5,
        areaSqft: 4500,
        images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500'],
        sellerId: seller._id,
        status: 'available'
      },
      {
        title: 'Affordable 2BHK Flat in Delhi',
        description: 'Well connected and recently renovated flat.',
        location: 'Dwarka',
        address: 'Flat 12B, Sector 6',
        city: 'Delhi',
        price: 8500000,
        propertyType: 'apartment',
        bedrooms: 2,
        bathrooms: 2,
        areaSqft: 950,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1c2440d734?w=500'],
        sellerId: seller._id,
        status: 'available'
      },
      {
        title: 'Commercial Office Space in Bangalore',
        description: 'Prime location for startups and businesses.',
        location: 'Indiranagar',
        address: '100 Feet Road, HAL 2nd Stage',
        city: 'Bangalore',
        price: 25000000,
        propertyType: 'commercial',
        bedrooms: 0,
        bathrooms: 2,
        areaSqft: 1200,
        images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=500'],
        sellerId: seller._id,
        status: 'available'
      },
      {
        title: 'Family House in Hyderabad',
        description: 'Quiet neighborhood perfect for a family.',
        location: 'Jubilee Hills',
        address: 'Road No 36',
        city: 'Hyderabad',
        price: 42000000,
        propertyType: 'house',
        bedrooms: 4,
        bathrooms: 3,
        areaSqft: 3200,
        images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500'],
        sellerId: seller._id,
        status: 'available'
      }
    ];

    const insertedProperties = await Property.insertMany(properties);

    // Give buyer some saved properties
    buyer.savedProperties = [insertedProperties[0]._id, insertedProperties[2]._id];
    await buyer.save();

    res.status(200).json({ message: 'Database seeded successfully', buyer, seller });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
