import express from 'express';
import {
  addOrderItems,
  getOrderById,
  getMyOrders,
  applyCoupon
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, addOrderItems);
router.route('/myorders')
  .get(protect, getMyOrders);
router.route('/coupon')
  .post(protect, applyCoupon);
router.route('/:id')
  .get(protect, getOrderById);

export default router;
