import { Request, Response } from 'express';
import { Deal } from '../models/Deal';
import { Property } from '../models/Property';
import { Notification } from '../models/Notification';

export const getDeals = async (req: any, res: Response): Promise<void> => {
  try {
    const query = req.user.role === 'buyer' ? { buyerId: req.user.id } : { sellerId: req.user.id };
    const deals = await Deal.find(query).populate('propertyId').populate('buyerId', 'name').populate('sellerId', 'name');
    res.json(deals);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDealById = async (req: any, res: Response): Promise<void> => {
  try {
    const deal = await Deal.findById(req.params.dealId).populate('propertyId').populate('buyerId', 'name').populate('sellerId', 'name');
    
    if (deal) {
      if (deal.buyerId._id.toString() !== req.user.id && deal.sellerId._id.toString() !== req.user.id) {
        res.status(403).json({ message: 'Not authorized to view this deal' });
        return;
      }
      res.json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const startDeal = async (req: any, res: Response): Promise<void> => {
  try {
    const { propertyId, amount, note } = req.body;
    
    const property = await Property.findById(propertyId);
    if (!property) {
      res.status(404).json({ message: 'Property not found' });
      return;
    }

    // Check if deal already exists
    let deal = await Deal.findOne({ propertyId, buyerId: req.user.id });
    
    if (!deal) {
      deal = new Deal({
        propertyId,
        buyerId: req.user.id,
        sellerId: property.sellerId,
        status: 'active',
        offers: [],
        messages: []
      });
    }

    if (amount) {
      deal.offers.push({
        amount,
        senderId: req.user.id,
        senderRole: req.user.role,
        status: 'pending',
        note
      });
    }

    await deal.save();
    
    if (amount) {
      const { io } = require('../server');
      io.to(deal._id.toString()).emit('deal_updated', deal);
    }
    
    res.status(201).json(deal);
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const addOffer = async (req: any, res: Response): Promise<void> => {
  try {
    const { amount, note } = req.body;
    const deal = await Deal.findById(req.params.dealId);

    if (deal) {
      const offer = {
        amount,
        senderId: req.user.id,
        senderRole: req.user.role,
        status: 'pending',
        note
      };
      
      // If we are adding a new offer, any existing pending offers should probably be countered/closed
      deal.offers.forEach(o => {
        if (o.status === 'pending') {
          o.status = 'countered';
        }
      });

      deal.offers.push(offer);
      deal.markModified('offers');
      await deal.save();

      const recipientId = req.user.role === 'buyer' ? deal.sellerId : deal.buyerId;
      const notif = await Notification.create({
        user: recipientId,
        title: 'New Offer Received',
        message: `You received a new offer of ₹${amount} for a property.`,
        type: 'offer',
        link: `/negotiation/${deal._id}`
      });

      const { io } = require('../server');
      io.to(deal._id.toString()).emit('deal_updated', deal);
      io.emit(`notification_${recipientId}`, notif);
      
      res.status(201).json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOfferStatus = async (req: any, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'accepted', 'rejected'
    const deal = await Deal.findById(req.params.dealId);

    if (deal) {
      const offer = deal.offers.id(req.params.offerId);
      
      if (!offer) {
        res.status(404).json({ message: 'Offer not found' });
        return;
      }

      // Sender cannot accept/reject their own offer
      if (offer.senderId.toString() === req.user.id) {
        res.status(403).json({ message: 'Cannot accept or reject your own offer' });
        return;
      }

      offer.status = status;

      if (status === 'accepted') {
        deal.status = 'accepted';
        // Close other pending offers
        deal.offers.forEach(o => {
          if (o.status === 'pending' && o._id.toString() !== offer._id.toString()) {
            o.status = 'countered';
          }
        });
        deal.markModified('offers');
        // Update property status and sold metadata
        await Property.findByIdAndUpdate(deal.propertyId, { 
          status: 'sold',
          soldTo: deal.buyerId,
          soldAt: new Date(),
          finalSoldPrice: offer.amount,
          acceptedDealId: deal._id
        });
      } else if (status === 'rejected') {
        // Deal remains active, just this offer is rejected
      }

      await deal.save();
      
      const recipientId = offer.senderId;
      const actionText = status === 'accepted' ? 'accepted' : 'rejected';
      const notif = await Notification.create({
        user: recipientId,
        title: `Offer ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your offer of ₹${offer.amount} has been ${actionText}.`,
        type: 'offer',
        link: `/negotiation/${deal._id}`
      });

      const { io } = require('../server');
      io.to(deal._id.toString()).emit('deal_updated', deal);
      io.emit(`notification_${recipientId}`, notif);
      
      res.json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addMessage = async (req: any, res: Response): Promise<void> => {
  try {
    const { content } = req.body;
    const deal = await Deal.findById(req.params.dealId);

    if (deal) {
      const message = {
        senderId: req.user.id,
        senderRole: req.user.role,
        content
      };

      deal.messages.push(message);
      await deal.save();

      const { io } = require('../server');
      io.to(deal._id.toString()).emit('receive_message', message);
      res.status(201).json(deal);
    } else {
      res.status(404).json({ message: 'Deal not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
