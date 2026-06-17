import express from 'express';
import {
  createBook,
  updateBook,
  deleteBook,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole,
  getSalesAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect and admin middleware to all routes in this router
router.use(protect);
router.use(admin);

router.get('/analytics', getSalesAnalytics);

router.route('/books')
  .post(createBook);

router.route('/books/:id')
  .put(updateBook)
  .delete(deleteBook);

router.route('/orders')
  .get(getAllOrders);

router.route('/orders/:id/status')
  .put(updateOrderStatus);

router.route('/users')
  .get(getAllUsers);

router.route('/users/:id/role')
  .put(updateUserRole);

export default router;
