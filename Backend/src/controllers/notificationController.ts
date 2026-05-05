import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

export const getNotifications = async (req: any, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!notification) {
      res.status(404).json({ message: 'Notification not found' });
      return;
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const markAllAsRead = async (req: any, res: Response): Promise<void> => {
  try {
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
