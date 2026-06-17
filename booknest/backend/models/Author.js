import mongoose from 'mongoose';

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide the author name'],
    unique: true,
    trim: true
  },
  photo: {
    type: String,
    required: [true, 'Please provide an author portrait URL']
  },
  bio: {
    type: String,
    required: [true, 'Please provide the author biography']
  },
  field: {
    type: String,
    enum: ['literature', 'sports', 'entrepreneurship', 'technology', 'finance', 'creation'],
    required: [true, 'Please specify the author field/specialization']
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  relatedAuthors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Author = mongoose.model('Author', authorSchema);
export default Author;
