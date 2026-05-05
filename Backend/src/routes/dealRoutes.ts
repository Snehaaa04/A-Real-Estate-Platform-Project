import express from 'express';
import { getDeals, getDealById, startDeal, addOffer, updateOfferStatus, addMessage } from '../controllers/dealController';
import { protect, buyerOnly } from '../middleware/auth';

const router = express.Router();

router.get('/', protect, getDeals);
router.get('/:dealId', protect, getDealById);
router.post('/start', protect, buyerOnly, startDeal);
router.post('/:dealId/offers', protect, addOffer);
router.patch('/:dealId/offers/:offerId/status', protect, updateOfferStatus);
router.post('/:dealId/messages', protect, addMessage);

export default router;
