import express from 'express';
import { getSavedProperties, saveProperty, unsaveProperty } from '../controllers/savedPropertyController';
import { protect, buyerOnly } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(protect, buyerOnly, getSavedProperties);

router.route('/:propertyId')
  .post(protect, buyerOnly, saveProperty)
  .delete(protect, buyerOnly, unsaveProperty);

export default router;
