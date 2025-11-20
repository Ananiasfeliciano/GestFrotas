import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'manager', 'operator']).optional().default('manager')
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const vehicleSchema = z.object({
  plate: z.string().min(1, 'Placa é obrigatória').max(10),
  model: z.string().optional(),
  brand: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  km: z.number().min(0).optional(),
  status: z.enum(['active', 'inactive', 'maintenance']).optional().default('active')
});

export const vehicleUpdateSchema = vehicleSchema.partial();
