import type { z } from 'zod';
import type { DevicePlatform, DeviceStatus } from '../../database/schema';
import {
  devicePayloadSchema,
  deviceUpsertSchema,
  deviceStatusUpdateSchema
} from './device.schemas';

export type DevicePayload = z.infer<typeof devicePayloadSchema>;
export type DeviceUpsertPayload = z.infer<typeof deviceUpsertSchema>;
export type DeviceStatusUpdatePayload = z.infer<typeof deviceStatusUpdateSchema>;

export type DeviceRecord = {
  deviceId: string;
  label?: string | undefined;
  platform: DevicePlatform;
  model?: string | undefined;
  manufacturer?: string | undefined;
  osVersion?: string | undefined;
  tags: string[];
  metadata?: Record<string, unknown> | undefined;
  status: DeviceStatus;
  lastIp?: string | undefined;
  geo?: DeviceStatusUpdatePayload['geo'] | undefined;
  createdAt: string;
  updatedAt: string;
};

