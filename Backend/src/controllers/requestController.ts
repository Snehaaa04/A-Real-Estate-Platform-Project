import { Request, Response } from 'express';
import { RequestModel } from '../models/Request';
import { Property } from '../models/Property';
import { Notification } from '../models/Notification';

export const createRequest = async (req: any, res: Response): Promise<void> => {
  try {
    const { propertyId, type, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    const newRequest = await RequestModel.create({
      propertyId,
      buyerId: req.user.id,
      sellerId: property.sellerId,
      type,
      message,
      status: 'pending'
    });

    // Notify seller
    const notif = await Notification.create({
      user: property.sellerId,
      title: `New ${type.toUpperCase()} Request`,
      message: `You received a request to ${type} property: ${property.title}`,
      type: 'system',
      link: '/seller/requests'
    });

    const { io } = require('../server');
    io.emit(`notification_${property.sellerId}`, notif);

    res.status(201).json(newRequest);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBuyerRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const requests = await RequestModel.find({ buyerId: req.user.id })
      .populate('propertyId', 'title location city images')
      .populate('sellerId', 'name email dealerData')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSellerRequests = async (req: any, res: Response): Promise<void> => {
  try {
    const requests = await RequestModel.find({ sellerId: req.user.id })
      .populate('propertyId', 'title location city images')
      .populate('buyerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRequestStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    const request = await RequestModel.findById(req.params.id).populate('propertyId', 'title');

    if (!request) {
      res.status(404).json({ message: 'Request not found' });
      return;
    }

    if (request.sellerId.toString() !== req.user.id) {
      res.status(403).json({ message: 'Not authorized to update this request' });
      return;
    }

    request.status = status;
    await request.save();

    // Notify buyer
    const propertyTitle = (request.propertyId as any)?.title || 'Property';
    const notif = await Notification.create({
      user: request.buyerId,
      title: `Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your request to ${request.type} '${propertyTitle}' has been ${status}.`,
      type: 'system',
      link: '/buyer/requests'
    });

    const { io } = require('../server');
    io.emit(`notification_${request.buyerId}`, notif);

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
