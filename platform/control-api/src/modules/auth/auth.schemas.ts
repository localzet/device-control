import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string()
    .min(3)
    .regex(/^[a-zA-Z0-9_\-]+$/, 'Username may only contain letters, numbers, dash, underscore'),
  password: z.string().min(8),
  role: z.enum(['owner', 'admin', 'analyst']).optional()
});

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(1)
});

