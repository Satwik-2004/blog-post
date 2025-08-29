import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../types';

interface JWTPayload {
  userId: string;
  username: string;
  iat: number;
  exp: number;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Access denied. No valid token provided.',
        details: 'Authorization header must be in format: Bearer <token>'
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!process.env.JWT_SECRET) {
      res.status(500).json({
        message: 'Internal server error',
        details: 'JWT_SECRET not configured'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload;
    
    req.user = {
      userId: decoded.userId,
      username: decoded.username
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: 'Access denied. Token expired.',
        details: 'Please login again'
      });
      return;
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: 'Access denied. Invalid token.',
        details: 'Token is malformed or invalid'
      });
      return;
    }

    res.status(500).json({
      message: 'Internal server error',
      details: 'Token verification failed'
    });
  }
};

export default auth;