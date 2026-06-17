import Author from '../models/Author.js';
import Book from '../models/Book.js';

// @desc    Get all authors
// @route   GET /api/authors
// @access  Public
export const getAuthors = async (req, res) => {
  try {
    const { isFeatured } = req.query;
    const query = {};
    
    if (isFeatured) {
      query.isFeatured = isFeatured === 'true';
    }

    const authors = await Author.find(query).sort({ name: 1 });
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single author details and their books
// @route   GET /api/authors/:id
// @access  Public
export const getAuthorById = async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
      .populate('relatedAuthors', 'id name photo field');

    if (!author) {
      return res.status(404).json({ message: 'Author profile not found' });
    }

    // Find all books associated with this author
    const books = await Book.find({ authorRef: author._id }).sort({ rating: -1 });

    res.json({
      author,
      books
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
