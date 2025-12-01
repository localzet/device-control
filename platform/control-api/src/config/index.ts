import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const environmentSchema = z.object({
  SERVICE_NAME: z.string().min(1).default('control-api'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CONTROL_API_PORT: z.coerce.number().int().positive().default(4000),
  CONTROL_API_HOST: z.string().min(1).default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  ENABLE_CORS: z.enum(['true', 'false']).default('true'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').optional(),
  JWT_EXPIRES_IN: z.string().default('1d'),
  DATABASE_URL: z
    .string()
    .url()
    .optional()
});

export type ServiceConfig = {
  serviceName: string;
  env: 'development' | 'production' | 'test';
  port: number;
  host: string;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  enableCors: boolean;
  jwtSecret?: string;
  jwtExpiresIn: string;
  databaseUrl?: string;
};

export const loadConfig = (): ServiceConfig => {
  const parsed = environmentSchema.parse(process.env);

  return {
    serviceName: parsed.SERVICE_NAME,
    env: parsed.NODE_ENV,
    port: parsed.CONTROL_API_PORT,
    host: parsed.CONTROL_API_HOST,
    logLevel: parsed.LOG_LEVEL,
    enableCors: parsed.ENABLE_CORS === 'true',
    jwtExpiresIn: parsed.JWT_EXPIRES_IN,
    ...(parsed.JWT_SECRET ? { jwtSecret: parsed.JWT_SECRET } : {}),
    ...(parsed.DATABASE_URL ? { databaseUrl: parsed.DATABASE_URL } : {})
  };
};

