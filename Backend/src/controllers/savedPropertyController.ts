import { Request, Response } from 'express';
import { User } from '../models/User';
import { Property } from '../models/Property';

export const getSavedProperties = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).populate('savedProperties');
    if (user) {
      res.json(user.savedProperties);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const saveProperty = async (req: any, res: Response): Promise<void> => {
  try {
    const propertyId = req.params.propertyId;
    const property = await Property.findById(propertyId);

    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (user) {
      if (!user.savedProperties.includes(propertyId)) {
        user.savedProperties.push(propertyId);
        await user.save();
      }
      res.json({ message: 'Property saved' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const unsaveProperty = async (req: any, res: Response): Promise<void> => {
  try {
    const propertyId = req.params.propertyId;
    const user = await User.findById(req.user.id);
    
    if (user) {
      user.savedProperties = user.savedProperties.filter(id => id.toString() !== propertyId);
      await user.save();
      res.json({ message: 'Property unsaved' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
