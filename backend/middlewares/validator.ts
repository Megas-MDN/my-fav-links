
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Create a higher-order function that takes a Zod schema
export const validate = (schema: z.ZodType<any, any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate the request body against the schema
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format the errors in a more user-friendly way
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({ 
          error: 'Validation failed', 
          details: errors 
        });
      } else {
        next(error);
      }
    }
  };
};

// Card validation schemas
export const cardCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  urls: z.array(
    z.object({
      value: z.string().min(1, 'URL value is required'),
    })
  ).min(1, 'At least one URL is required'),
  imageUrl: z.string().optional(),
});

export const cardUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  imageUrl: z.string().optional(),
});

export const urlCreateSchema = z.object({
  value: z.string().min(1, 'URL value is required'),
});
