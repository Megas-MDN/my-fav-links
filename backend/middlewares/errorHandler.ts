
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Handle Prisma specific errors
  if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2001': // Record not found
      case 'P2025': // Record not found
        return res.status(404).json({ error: 'Resource not found' });
      case 'P2002': // Unique constraint violation
        return res.status(409).json({ error: 'Resource already exists' });
      default:
        return res.status(500).json({ error: 'Database error' });
    }
  }

  // Handle validation errors (typically from middleware)
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  // Handle other known error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Default error response
  res.status(500).json({ error: 'Internal server error' });
};
