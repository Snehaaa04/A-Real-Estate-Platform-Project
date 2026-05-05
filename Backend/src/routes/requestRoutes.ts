import express from 'express';
import { createRequest, getBuyerRequests, getSellerRequests, updateRequestStatus } from '../controllers/requestController';
import { protect, buyerOnly, sellerOnly } from '../middleware/auth';

const router = express.Router();

router.post('/', protect, buyerOnly, createRequest);
router.get('/buyer', protect, buyerOnly, getBuyerRequests);
router.get('/seller', protect, sellerOnly, getSellerRequests);
router.patch('/:id/status', protect, sellerOnly, updateRequestStatus);

export default router;
