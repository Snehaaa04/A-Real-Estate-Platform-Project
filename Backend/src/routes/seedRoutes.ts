import express from 'express';
import { seedDatabase } from '../controllers/seedController';

const router = express.Router();

router.post('/', seedDatabase);

export default router;
