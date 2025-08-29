import mongoose, { Schema, Types } from 'mongoose';
import { IPost } from '../types';

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters'],
    maxlength: [120, 'Title cannot exceed 120 characters']
  },
  imageURL: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Optional field
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [50, 'Content must be at least 50 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  userId: {
    type: Schema.Types.ObjectId, // This is correct for Mongoose
    ref: 'User',
    required: [true, 'User ID is required']
  }
}, {
  timestamps: true
});

// Create indexes for better search performance
postSchema.index({ title: 'text', username: 'text' });
postSchema.index({ createdAt: -1 });
postSchema.index({ userId: 1 });

export default mongoose.model<IPost>('Post', postSchema);