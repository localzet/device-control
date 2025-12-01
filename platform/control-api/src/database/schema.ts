import type { ColumnType, Generated } from 'kysely';

export type DeviceStatus = 'online' | 'offline' | 'unknown';
export type DevicePlatform = 'android' | 'android-tv' | 'windows' | 'linux';
export type OperatorRole = 'owner' | 'admin' | 'analyst';

export interface DevicesTable {
  id: Generated<number>;
  device_id: string;
  label: string | null;
  platform: DevicePlatform;
  model: string | null;
  manufacturer: string | null;
  os_version: string | null;
  tags: ColumnType<string[] | null, string[] | null, string[] | null>;
  metadata: ColumnType<Record<string, unknown> | null, Record<string, unknown> | null, Record<string, unknown> | null>;
  status: DeviceStatus;
  last_ip: string | null;
  geo_country: string | null;
  geo_city: string | null;
  geo_lat: ColumnType<number | null, number | null, number | null>;
  geo_lon: ColumnType<number | null, number | null, number | null>;
  created_at: ColumnType<Date, string | Date, never>;
  updated_at: ColumnType<Date, string | Date, string | Date>;
}

export interface OperatorsTable {
  id: Generated<number>;
  username: string;
  password_hash: string;
  role: OperatorRole;
  is_active: ColumnType<boolean, boolean | undefined, boolean>;
  created_at: ColumnType<Date, string | Date, never>;
  updated_at: ColumnType<Date, string | Date, string | Date>;
}

export interface OperatorSessionsTable {
  id: Generated<number>;
  operator_id: number;
  token_id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: ColumnType<Date, string | Date, never>;
  expires_at: ColumnType<Date, string | Date, string | Date>;
}

export interface Database {
  devices: DevicesTable;
  operators: OperatorsTable;
  operator_sessions: OperatorSessionsTable;
}

