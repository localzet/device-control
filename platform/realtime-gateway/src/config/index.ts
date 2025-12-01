import { config as loadEnv } from 'dotenv';
import { z } from 'zod';

loadEnv();

const environmentSchema = z.object({
  SERVICE_NAME: z.string().min(1).default('realtime-gateway'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  GATEWAY_PORT: z.coerce.number().int().positive().default(22222),
  GATEWAY_HOST: z.string().min(1).default('0.0.0.0'),
  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
    .default('info'),
  CONTROL_API_URL: z.string().url().default('http://localhost:4000'),
  ENABLE_CORS: z.enum(['true', 'false']).default('true')
});

export type GatewayConfig = {
  serviceName: string;
  env: 'development' | 'production' | 'test';
  port: number;
  host: string;
  logLevel: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent';
  controlApiUrl: string;
  enableCors: boolean;
};

export const loadConfig = (): GatewayConfig => {
  const parsed = environmentSchema.parse(process.env);

  return {
    serviceName: parsed.SERVICE_NAME,
    env: parsed.NODE_ENV,
    port: parsed.GATEWAY_PORT,
    host: parsed.GATEWAY_HOST,
    logLevel: parsed.LOG_LEVEL,
    controlApiUrl: parsed.CONTROL_API_URL,
    enableCors: parsed.ENABLE_CORS === 'true'
  };
};

