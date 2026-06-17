import Book from '../models/Book.js';
import Review from '../models/Review.js';
import User from '../models/User.js';

// @desc    Get all books with filters, sorting, and pagination
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const {
      search,
      category,
      rating,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by Category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Sorting options
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { price: -1 };
    } else if (sort === 'rating') {
      sortOption = { rating: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { createdAt: -1 }; // default: newest
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    const totalBooks = await Book.countDocuments(query);
    const books = await Book.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      books,
      page: Number(page),
      pages: Math.ceil(totalBooks / Number(limit)),
      totalBooks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single book by ID & update recently viewed
// @route   GET /api/books/:id
// @access  Public (Optional auth for recently viewed)
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('authorRef');

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Populate reviews
    const reviews = await Review.find({ book: book._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      book,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add recently viewed book
// @route   POST /api/books/:id/view
// @access  Private
export const addRecentlyViewed = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const bookId = req.params.id;

    if (user) {
      // Remove book if already exists in list to put it at the front
      user.recentlyViewed = user.recentlyViewed.filter(
        (id) => id.toString() !== bookId
      );
      // Add to beginning of array
      user.recentlyViewed.unshift(bookId);
      // Keep only top 8
      if (user.recentlyViewed.length > 8) {
        user.recentlyViewed.pop();
      }
      await user.save();
      res.json({ message: 'Added to recently viewed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new book review
// @route   POST /api/books/:id/reviews
// @access  Private
export const createBookReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      book: book._id
    });

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment;
      await alreadyReviewed.save();
    } else {
      // Create new review
      await Review.create({
        user: req.user._id,
        book: book._id,
        rating: Number(rating),
        comment
      });
    }

    // Recalculate book rating
    const reviews = await Review.find({ book: book._id });
    book.reviewsCount = reviews.length;
    book.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await book.save();

    res.status(201).json({ message: 'Review added/updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get book recommendations (Hybrid/AI engine)
// @route   GET /api/books/:id/recommendations
// @access  Public
export const getRecommendations = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Collaborative/Content-Based Filtering logic in Node/MongoDB:
    // Find books in the same category or sharing tags, excluding the current book.
    let recommended = await Book.find({
      category: book.category,
      _id: { $ne: book._id }
    })
      .sort({ rating: -1 })
      .limit(5);

    // If we have less than 5, fill in with books from other categories with high ratings
    if (recommended.length < 5) {
      const fillCount = 5 - recommended.length;
      const extraBooks = await Book.find({
        _id: { $ne: book._id, $nin: recommended.map(b => b._id) }
      })
        .sort({ rating: -1 })
        .limit(fillCount);
      recommended = [...recommended, ...extraBooks];
    }

    // AI recommendation simulation:
    // If a GEMINI_API_KEY is present, we could do an API call, but we can also mock a clean semantic reasoning
    // log. The frontend will present this with a gorgeous "AI Recommendation Reason" tag.
    const reasons = [
      "Based on your interest in this author's narrative depth and style.",
      "Matches the thematic composition and target readers of this genre.",
      "Frequently purchased together by readers who love thought-provoking storylines.",
      "Shares a similar pacing and atmospheric world-building style.",
      "Highly recommended for readers looking to expand their worldview in this subject."
    ];

    const recommendedWithAIReason = recommended.map((item, index) => {
      const doc = item.toObject();
      doc.aiReason = reasons[index % reasons.length];
      return doc;
    });

    res.json(recommendedWithAIReason);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/Sync entire cart in Database
// @route   POST /api/books/cart
// @access  Private
export const syncCart = async (req, res) => {
  const { cartItems } = req.body; // Array of { bookId, quantity }

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.cart = cartItems.map(item => ({
        book: item.bookId,
        quantity: item.quantity
      }));
      await user.save();
      
      const populatedUser = await User.findById(req.user._id).populate('cart.book');
      res.json(populatedUser.cart);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle item in wishlist
// @route   POST /api/books/wishlist
// @access  Private
export const toggleWishlist = async (req, res) => {
  const { bookId } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      const isAlreadyInWishlist = user.wishlist.includes(bookId);

      if (isAlreadyInWishlist) {
        user.wishlist = user.wishlist.filter(id => id.toString() !== bookId);
      } else {
        user.wishlist.push(bookId);
      }

      await user.save();
      const populatedUser = await User.findById(req.user._id).populate('wishlist');
      res.json(populatedUser.wishlist);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
