import express, { Request, Response } from 'express';
import { Types } from 'mongoose';
import Post from '../models/Post';
import auth from '../middleware/auth';
import { AuthRequest, CreatePostRequest, UpdatePostRequest, PostsResponse, IPost } from '../types';

const router = express.Router();

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};

// IMPORTANT: Put specific routes BEFORE parameterized routes
// GET posts by current user (protected) - SPECIFIC ROUTE FIRST
router.get('/user/me', auth, async (req: AuthRequest, res: Response<PostsResponse>) => {
  try {
    const {
      page = '1',
      limit = '10'
    } = req.query;

    if (!req.user) {
      res.status(401).json({
        posts: [],
        totalPages: 0,
        currentPage: 1,
        total: 0
      });
      return;
    }

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));

    const posts = await Post.find({ userId: new Types.ObjectId(req.user.userId) })
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .lean();

    const total = await Post.countDocuments({ userId: new Types.ObjectId(req.user.userId) });
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      posts: posts as IPost[],
      totalPages,
      currentPage: pageNum,
      total
    });

  } catch (error) {
    console.error('Get user posts error:', error);
    res.status(500).json({
      posts: [],
      totalPages: 0,
      currentPage: 1,
      total: 0
    });
  }
});

// GET all posts with pagination and search - ROOT ROUTE
router.get('/', async (req: Request, res: Response<PostsResponse>) => {
  try {
    const {
      search = '',
      page = '1',
      limit = '10'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page as string));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));

    // Build search query
    const searchQuery = search ? {
      $or: [
        { title: { $regex: search as string, $options: 'i' } },
        { username: { $regex: search as string, $options: 'i' } }
      ]
    } : {};

    // Get posts with pagination
    const posts = await Post.find(searchQuery)
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .lean();

    // Get total count for pagination
    const total = await Post.countDocuments(searchQuery);
    const totalPages = Math.ceil(total / limitNum);

    res.json({
      posts: posts as IPost[],
      totalPages,
      currentPage: pageNum,
      total
    });

  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      posts: [],
      totalPages: 0,
      currentPage: 1,
      total: 0
    });
  }
});

// CREATE new post (protected)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, imageURL, content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    // Create new post
    const post = new Post({
      title: title?.trim(),
      imageURL: imageURL?.trim(),
      content: content?.trim(),
      username: req.user.username,
      userId: new Types.ObjectId(req.user.userId)
    });

    const savedPost = await post.save();

    res.status(201).json({
      message: 'Post created successfully',
      post: savedPost
    });

  } catch (error: any) {
    console.error('Create post error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        message: `Validation failed: ${validationErrors.join(', ')}`
      });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET single post by ID - PARAMETERIZED ROUTE AFTER SPECIFIC ROUTES
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid post ID format' });
      return;
    }

    const post = await Post.findById(id).lean();

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    res.json({ post: post as IPost });

  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// UPDATE post (protected, owner only)
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, imageURL, content } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid post ID format' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Access denied. You can only update your own posts.' });
      return;
    }

    if (title !== undefined) post.title = title.trim();
    if (imageURL !== undefined) post.imageURL = imageURL?.trim();
    if (content !== undefined) post.content = content.trim();

    const updatedPost = await post.save();

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });

  } catch (error: any) {
    console.error('Update post error:', error);

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        message: `Validation failed: ${validationErrors.join(', ')}`
      });
      return;
    }

    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE post (protected, owner only)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!isValidObjectId(id)) {
      res.status(400).json({ message: 'Invalid post ID format' });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.userId.toString() !== req.user.userId) {
      res.status(403).json({ message: 'Access denied. You can only delete your own posts.' });
      return;
    }

    await Post.findByIdAndDelete(id);

    res.json({ message: 'Post deleted successfully' });

  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;