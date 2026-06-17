import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// Coupons database mapping
const VALID_COUPONS = {
  'BOOKWORM10': 10,
  'NEST20': 20,
  'READMORE30': 30
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const addOrderItems = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    totalAmount,
    couponCode,
    discountApplied
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  try {
    // Check stock levels first
    for (const item of orderItems) {
      const book = await Book.findById(item.bookId);
      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.title}` });
      }
      if (book.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems.map((item) => ({
        book: item.bookId,
        quantity: item.quantity,
        price: item.price
      })),
      shippingAddress,
      totalAmount,
      couponCode,
      discountApplied,
      paymentStatus: 'paid' // Simulated mock checkout resolves immediately
    });

    const createdOrder = await order.save();

    // Deduct stock for each purchased book
    for (const item of orderItems) {
      await Book.findByIdAndUpdate(item.bookId, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear user cart in DB
    await User.findByIdAndUpdate(req.user._id, { cart: [] });

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.book');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow owner or admin to view
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.book')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate coupon code
// @route   POST /api/orders/coupon
// @access  Private
export const applyCoupon = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  const discount = VALID_COUPONS[code.toUpperCase()];

  if (discount !== undefined) {
    res.json({
      success: true,
      discount,
      message: `${discount}% discount applied successfully!`
    });
  } else {
    res.status(400).json({
      success: false,
      message: 'Invalid discount coupon code'
    });
  }
};
