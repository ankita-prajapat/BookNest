import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a book title'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true
  },
  authorRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  description: {
    type: String,
    required: [true, 'Please provide a book description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: [
      'Novels',
      'Romance',
      'Poetry',
      'Self Help',
      'Personal Development',
      'Business',
      'Finance',
      'Biographies',
      'Sports Personalities',
      'Motivation',
      'Fiction',
      'Mystery & Thriller',
      'Fantasy',
      'Young Adult'
    ]
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image URL']
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock level'],
    min: [0, 'Stock cannot be negative'],
    default: 10
  },
  tags: [{
    type: String
  }],
  isBestseller: {
    type: Boolean,
    default: false
  },
  isNewArrival: {
    type: Boolean,
    default: false
  },
  featuredAuthor: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Book = mongoose.model('Book', bookSchema);
export default Book;
