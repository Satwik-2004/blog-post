import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types';

const router = express.Router();

// Register
router.post('/register', async (req: Request<{}, AuthResponse, RegisterRequest>, res: Response<AuthResponse>) => {
  try {
    const { username, email, password } = req.body;

    // Input validation
    if (!username || !email || !password) {
      res.status(400).json({
        message: 'Validation error',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      res.status(400).json({
        message: `User with this ${field} already exists`,
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    // Create new user
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await user.save();

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        message: 'Internal server error',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      res.status(400).json({
        message: 'Validation failed',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    res.status(500).json({
      message: 'Internal server error',
      token: '',
      user: { id: '', username: '', email: '' }
    });
  }
});

// Login
router.post('/login', async (req: Request<{}, AuthResponse, LoginRequest>, res: Response<AuthResponse>) => {
  try {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      res.status(400).json({
        message: 'Email and password are required',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({
        message: 'Invalid credentials',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    // Check password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        message: 'Invalid credentials',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        message: 'Internal server error',
        token: '',
        user: { id: '', username: '', email: '' }
      });
      return;
    }

    const token = jwt.sign(
      { userId: user._id.toString(), username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error',
      token: '',
      user: { id: '', username: '', email: '' }
    });
  }
});

export default router;