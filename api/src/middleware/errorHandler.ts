import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  error: string;
  details?: any;
  status?: number;
}

export class AppError extends Error {
  status: number;
  details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.message,
      details: err.details
    });
  }

  // Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    if (prismaError.code === 'P2002') {
      return res.status(400).json({ error: 'Registro duplicado' });
    }
    
    if (prismaError.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado' });
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: (err as any).errors
    });
  }

  // Default error
  res.status(500).json({
    error: process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : err.message
  });
};
