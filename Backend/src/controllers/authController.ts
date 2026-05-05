import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phoneNumber, password, role, gender, state, city, pincode } = req.body;

    const emailExists = await User.findOne({ email, role });
    if (emailExists) {
      res.status(400).json({ message: 'User already exists with this email for selected role' });
      return;
    }

    const phoneExists = await User.findOne({ phoneNumber, role });
    if (phoneExists) {
      res.status(400).json({ message: 'User already exists with this phone number for selected role' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      gender,
      state,
      city,
      pincode
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server Error', details: error.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password, role } = req.body;

    let query: any = { role };
    if (identifier.includes('@')) {
      query.email = identifier;
    } else {
      query.phoneNumber = identifier;
    }

    const user = await User.findOne(query);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString(), user.role)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials or role' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMe = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateProfile = async (req: any, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.name = req.body.name || user.name;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    user.gender = req.body.gender || user.gender;
    user.city = req.body.city || user.city;
    user.state = req.body.state || user.state;
    user.pincode = req.body.pincode || user.pincode;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      gender: updatedUser.gender,
      city: updatedUser.city,
      state: updatedUser.state,
      pincode: updatedUser.pincode,
      token: generateToken(updatedUser._id.toString(), updatedUser.role)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
