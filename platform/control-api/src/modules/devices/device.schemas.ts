import { z } from 'zod';

export const devicePayloadSchema = z.object({
  deviceId: z.string().min(6),
  label: z.string().min(1).optional(),
  platform: z.enum(['android', 'android-tv', 'windows', 'linux']).default('android'),
  model: z.string().optional(),
  manufacturer: z.string().optional(),
  osVersion: z.string().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.string(), z.any()).optional()
});

export const statusSchema = z.object({
  status: z.enum(['online', 'offline', 'unknown']).default('unknown'),
  lastIp: z.string().optional(),
  geo: z
    .object({
      country: z.string().optional(),
      city: z.string().optional(),
      lat: z.number().optional(),
      lon: z.number().optional()
    })
    .optional()
});

export const deviceUpsertSchema = devicePayloadSchema.extend({
  status: statusSchema.shape.status.optional(),
  lastIp: statusSchema.shape.lastIp,
  geo: statusSchema.shape.geo
});

export const deviceQuerySchema = z.object({
  status: statusSchema.shape.status.optional()
});

export const deviceParamSchema = z.object({
  deviceId: z.string().min(1)
});

export const deviceStatusUpdateSchema = statusSchema;

