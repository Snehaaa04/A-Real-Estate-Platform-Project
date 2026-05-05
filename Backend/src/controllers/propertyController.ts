import { Request, Response } from 'express';
import { Property } from '../models/Property';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

export const seedProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    // Clear existing properties
    await Property.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const sellersData = [
      { name: 'Prime Realty (Demo)', email: 'seller1@demo.com', role: 'seller' as 'seller', phoneNumber: '9876543210', gender: 'male', state: 'Maharashtra', city: 'Mumbai', pincode: '400001' },
      { name: 'Apex Properties (Demo)', email: 'seller2@demo.com', role: 'seller' as 'seller', phoneNumber: '9876543211', gender: 'female', state: 'Delhi', city: 'Delhi', pincode: '110001' },
      { name: 'Urban Homes (Demo)', email: 'seller3@demo.com', role: 'seller' as 'seller', phoneNumber: '9876543212', gender: 'male', state: 'Karnataka', city: 'Bangalore', pincode: '560001' },
      { name: 'Demo Seller', email: 'seller@demo.com', role: 'seller' as 'seller', phoneNumber: '9876543213', gender: 'male', state: 'Maharashtra', city: 'Pune', pincode: '411001' }
    ];

    const sellers = [];
    for (const sData of sellersData) {
      let seller = await User.findOne({ email: sData.email });
      if (!seller) {
        seller = await User.create({
          ...sData,
          password: hashedPassword,
          dealerData: {
            transparencyScore: Math.floor(Math.random() * 20) + 80,
            successfulDeals: Math.floor(Math.random() * 100) + 10,
            complaints: Math.floor(Math.random() * 5),
            responseRate: Math.floor(Math.random() * 20) + 80,
            verifiedListings: 15,
            totalListings: 20,
            averageRating: Number((Math.random() * 1 + 4).toFixed(1))
          }
        });
      }
      sellers.push(seller);
    }

    const baseProperties = [
      { title: 'Luxury Sea-Facing Apartment', propType: 'apartment', city: 'Mumbai', price: 35000000, img: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Modern Villa in DLF Phase 5', propType: 'villa', city: 'Gurgaon', price: 45000000, img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop' },
      { title: 'Spacious Independent House', propType: 'independent house', city: 'Pune', price: 18000000, img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Cozy Studio Apartment', propType: 'studio apartment', city: 'Delhi', price: 5000000, img: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=2071&auto=format&fit=crop' },
      { title: 'Premium Penthouse with Skyline View', propType: 'penthouse', city: 'Noida', price: 65000000, img: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Tech Park Commercial Office', propType: 'commercial office', city: 'Bangalore', price: 120000000, img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop' },
      { title: 'High-Street Retail Shop', propType: 'shop', city: 'Hyderabad', price: 25000000, img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Residential Corner Plot', propType: 'plot', city: 'Chennai', price: 15000000, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2032&auto=format&fit=crop' },
      { title: 'Tranquil Farmhouse Getaway', propType: 'farmhouse', city: 'Jaipur', price: 55000000, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop' },
      { title: 'Elegant Duplex in Gated Community', propType: 'duplex', city: 'Kolkata', price: 22000000, img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Boutique Apartment near Metro', propType: 'apartment', city: 'Noida', price: 12000000, img: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop' },
      { title: 'Luxury Villa with Private Pool', propType: 'villa', city: 'Bangalore', price: 58000000, img: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Modern Independent Home', propType: 'independent house', city: 'Hyderabad', price: 21000000, img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop' },
      { title: 'IT Corridor Office Space', propType: 'commercial office', city: 'Pune', price: 85000000, img: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop' },
      { title: 'Prime Location Showroom', propType: 'shop', city: 'Mumbai', price: 42000000, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Investment Plot near Airport', propType: 'plot', city: 'Delhi', price: 30000000, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2032&auto=format&fit=crop' },
      { title: 'Lakeview Duplex Apartment', propType: 'duplex', city: 'Bangalore', price: 28000000, img: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?q=80&w=2073&auto=format&fit=crop' },
      { title: 'Heritage Style Farmhouse', propType: 'farmhouse', city: 'Jaipur', price: 45000000, img: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2069&auto=format&fit=crop' },
      { title: 'Premium Apartment with Amenities', propType: 'apartment', city: 'Chennai', price: 18000000, img: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop' },
      { title: 'Golf Course Facing Villa', propType: 'villa', city: 'Gurgaon', price: 75000000, img: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=1974&auto=format&fit=crop' }
    ];

    for (let i = 0; i < baseProperties.length; i++) {
      const bp = baseProperties[i];
      
      let seller;
      if (i < 5) {
        seller = sellers[3]; // seller@demo.com gets exactly 5 properties
      } else {
        seller = sellers[(i - 5) % 3]; // distribute among seller1, seller2, seller3
      }

      const noBedBath = ['plot', 'shop', 'commercial office'].includes(bp.propType);

      await Property.create({
        id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        title: bp.title,
        description: `This is a premium ${bp.propType} located in one of the most sought-after neighborhoods of ${bp.city}. It offers excellent amenities and connectivity.`,
        location: `${bp.city} Central`,
        address: `123 Main Road, ${bp.city} Central`,
        city: bp.city,
        price: bp.price,
        propertyType: bp.propType,
        bedrooms: noBedBath ? 0 : Math.floor(Math.random() * 4) + 1,
        bathrooms: noBedBath ? 0 : Math.floor(Math.random() * 3) + 1,
        areaSqft: Math.floor(Math.random() * 4000) + 500,
        images: [bp.img],
        sellerId: seller._id,
        status: 'available',
        priceBreakdown: {
          basePrice: bp.price * 0.9,
          registrationFee: bp.price * 0.01,
          stampDuty: bp.price * 0.05,
          gst: bp.price * 0.02,
          maintenanceFee: 50000,
          brokerageFee: bp.price * 0.01,
          otherCharges: bp.price * 0.01,
          totalEstimatedPrice: bp.price
        },
        propertyHistory: [
          { previousPrice: bp.price * 0.8, previousOwner: 'Previous Owner', statusChange: 'sold', changeDate: new Date('2020-01-01'), note: 'Purchased directly from developer' }
        ],
        areaRealityIndex: {
          city: bp.city,
          areaName: `${bp.city} Central`,
          safetyScore: Number((Math.random() * 2 + 7).toFixed(1)),
          connectivityScore: Number((Math.random() * 2 + 7).toFixed(1)),
          amenitiesScore: Number((Math.random() * 2 + 7).toFixed(1)),
          pollutionScore: Number((Math.random() * 3 + 5).toFixed(1)),
          averageRating: Number((Math.random() * 2 + 7).toFixed(1)),
          summary: `Great location with excellent growth potential in ${bp.city}.`
        },
        verification: {
          isVerified: Math.random() > 0.3,
          documentsVerified: true,
          ownershipVerified: true,
          priceVerified: true,
          verifiedAt: new Date()
        },
        transparencyScore: Math.floor(Math.random() * 20) + 80,
        dealerTransparencyScore: seller.dealerData?.transparencyScore || 85
      });
    }

    res.status(200).json({ message: 'Seeded successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Seed failed', error: error.message });
  }
};
export const getFilterOptions = async (req: Request, res: Response): Promise<void> => {
  try {
    const [cities, locations, propertyTypes, priceStats, areaStats] = await Promise.all([
      Property.distinct('city', { status: 'available' }),
      Property.distinct('location', { status: 'available' }),
      Property.distinct('propertyType', { status: 'available' }),
      Property.aggregate([
        { $match: { status: 'available' } },
        { $group: { _id: null, minPrice: { $min: '$price' }, maxPrice: { $max: '$price' } } }
      ]),
      Property.aggregate([
        { $match: { status: 'available' } },
        { $group: { _id: null, minArea: { $min: '$areaSqft' }, maxArea: { $max: '$areaSqft' } } }
      ])
    ]);

    res.json({
      cities,
      locations,
      propertyTypes,
      minPrice: priceStats[0]?.minPrice || 0,
      maxPrice: priceStats[0]?.maxPrice || 1000000000,
      minArea: areaStats[0]?.minArea || 0,
      maxArea: areaStats[0]?.maxArea || 10000
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProperties = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: any = {};
    
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search as string, 'i');
      query.$or = [
        { title: searchRegex },
        { propertyType: searchRegex },
        { city: searchRegex },
        { location: searchRegex },
        { address: searchRegex }
      ];
    }

    if (req.query.status) {
      query.status = req.query.status as string;
    } else {
      query.status = 'available';
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.minArea || req.query.maxArea) {
      query.areaSqft = {};
      if (req.query.minArea) query.areaSqft.$gte = Number(req.query.minArea);
      if (req.query.maxArea) query.areaSqft.$lte = Number(req.query.maxArea);
    }

    if (req.query.bedrooms) {
      const beds = String(req.query.bedrooms);
      if (beds === '4+') {
        query.bedrooms = { $gte: 4 };
      } else if (beds === '2-3') {
        query.bedrooms = { $gte: 2, $lte: 3 };
      } else {
        query.bedrooms = Number(beds);
      }
    }

    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType as string;
    }

    if (req.query.city) {
      query.city = { $regex: new RegExp(req.query.city as string, 'i') };
    }

    if (req.query.location) {
      query.location = { $regex: new RegExp(req.query.location as string, 'i') };
    }

    if (req.query.minTransparencyScore) {
      query.transparencyScore = { $gte: Number(req.query.minTransparencyScore) };
    }

    if (req.query.minAriScore) {
      query['areaRealityIndex.averageRating'] = { $gte: Number(req.query.minAriScore) };
    }

    if (req.query.verified === 'true') {
      query['verification.isVerified'] = true;
    }

    const properties = await Property.find(query).populate('sellerId', 'name email dealerData');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPropertyById = async (req: Request, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id).populate('sellerId', 'name email');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProperty = async (req: any, res: Response): Promise<void> => {
  try {
    const { 
      title, description, location, address, city, price, propertyType, bedrooms, bathrooms, areaSqft, images,
      priceBreakdown, propertyHistory, areaRealityIndex, verification, transparencyScore, dealerTransparencyScore
    } = req.body;

    const property = new Property({
      title,
      description,
      location,
      address,
      city,
      price,
      propertyType,
      bedrooms,
      bathrooms,
      areaSqft,
      images,
      sellerId: req.user.id,
      priceBreakdown,
      propertyHistory,
      areaRealityIndex,
      verification,
      transparencyScore,
      dealerTransparencyScore
    });

    const createdProperty = await property.save();
    res.status(201).json(createdProperty);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProperty = async (req: any, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.sellerId.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized to update this property' });
        return;
      }

      property.title = req.body.title || property.title;
      property.description = req.body.description || property.description;
      property.price = req.body.price || property.price;
      property.status = req.body.status || property.status;
      // Update other fields as needed...

      const updatedProperty = await property.save();
      res.json(updatedProperty);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProperty = async (req: any, res: Response): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      if (property.sellerId.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized to delete this property' });
        return;
      }

      await property.deleteOne();
      res.json({ message: 'Property removed' });
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSellerProperties = async (req: any, res: Response): Promise<void> => {
  try {
    const properties = await Property.find({ sellerId: req.user.id })
      .populate('soldTo', 'name email phone');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPurchasedProperties = async (req: any, res: Response): Promise<void> => {
  try {
    const properties = await Property.find({ soldTo: req.user.id })
      .populate('sellerId', 'name email phone dealerData')
      .populate('acceptedDealId');
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSellerAnalytics = async (req: any, res: Response): Promise<void> => {
  try {
    const properties = await Property.find({ sellerId: req.user.id });
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status !== 'sold').length;
    const soldProperties = properties.filter(p => p.status === 'sold').length;
    const totalValue = properties.reduce((acc, p) => acc + (p.price || 0), 0);

    // Generate mock historical data for last 7 days
    const viewsData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      viewsData.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        views: Math.floor(Math.random() * 50) + 10,
        inquiries: Math.floor(Math.random() * 10) + 1
      });
    }

    res.json({
      summary: {
        totalProperties,
        activeProperties,
        soldProperties,
        totalValue
      },
      viewsData
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
