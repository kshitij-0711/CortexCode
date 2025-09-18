const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true
  },
  language: {
    type: String,
    enum: ['javascript', 'python', 'java', 'c++', 'ruby', 'go', 'typescript'],
    required: true
  },
  reviewResult: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const reviewModal = mongoose.model("Review", reviewSchema);
