import express from 'express';
import { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty, getSellerProperties, seedProperties, getPurchasedProperties, getSellerAnalytics, getFilterOptions } from '../controllers/propertyController';
import { protect, sellerOnly, buyerOnly } from '../middleware/auth';

const router = express.Router();

router.post('/seed', seedProperties);
router.get('/filter-options', getFilterOptions);
router.get('/', getProperties);
router.get('/seller/analytics', protect, sellerOnly, getSellerAnalytics);
router.get('/seller/my-properties', protect, sellerOnly, getSellerProperties);
router.get('/buyer/my-purchased', protect, buyerOnly, getPurchasedProperties);
router.get('/:id', getPropertyById);
router.post('/', protect, sellerOnly, createProperty);
router.put('/:id', protect, sellerOnly, updateProperty);
router.delete('/:id', protect, sellerOnly, deleteProperty);

export default router;
