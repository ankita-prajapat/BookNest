import express from 'express';
import {
  getBooks,
  getBookById,
  addRecentlyViewed,
  createBookReview,
  getRecommendations,
  syncCart,
  toggleWishlist
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getBooks);
router.post('/cart', protect, syncCart);
router.post('/wishlist', protect, toggleWishlist);

router.get('/:id', getBookById);
router.post('/:id/view', protect, addRecentlyViewed);
router.post('/:id/reviews', protect, createBookReview);
router.get('/:id/recommendations', getRecommendations);

export default router;
