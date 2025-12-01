import type { Kysely, Selectable } from 'kysely';
import type { Database, DevicesTable, DeviceStatus } from '../../database/schema';
import type {
  DeviceRecord,
  DeviceStatusUpdatePayload,
  DeviceUpsertPayload
} from './device.types';

const memoryStore = new Map<string, DeviceRecord>();

type DeviceRow = Selectable<DevicesTable>;

const toRecord = (row: DeviceRow): DeviceRecord => {
  const record: DeviceRecord = {
    deviceId: row.device_id,
    platform: row.platform,
    tags: (row.tags as string[]) ?? [],
    status: row.status,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString()
  };

  if (row.label !== null) record.label = row.label;
  if (row.model !== null) record.model = row.model;
  if (row.manufacturer !== null) record.manufacturer = row.manufacturer;
  if (row.os_version !== null) record.osVersion = row.os_version;
  if (row.metadata) record.metadata = row.metadata as Record<string, unknown>;
  if (row.last_ip !== null) record.lastIp = row.last_ip;

  if (row.geo_country || row.geo_city || row.geo_lat || row.geo_lon) {
    record.geo = {
      country: row.geo_country ?? undefined,
      city: row.geo_city ?? undefined,
      lat: row.geo_lat ?? undefined,
      lon: row.geo_lon ?? undefined
    };
  }

  return record;
};

const mergeRecord = (
  payload: DeviceUpsertPayload,
  existing: DeviceRecord | undefined,
  now: string
): DeviceRecord => {
  const record: DeviceRecord = {
    deviceId: payload.deviceId,
    platform: payload.platform ?? existing?.platform ?? 'android',
    tags: payload.tags ?? existing?.tags ?? [],
    status: payload.status ?? existing?.status ?? 'unknown',
    createdAt: existing?.createdAt ?? now,
    updatedAt: now
  };

  const assign = <K extends keyof DeviceRecord>(key: K, value: DeviceRecord[K] | undefined) => {
    if (typeof value !== 'undefined') {
      record[key] = value;
    } else if (existing && typeof existing[key] !== 'undefined') {
      record[key] = existing[key];
    }
  };

  assign('label', payload.label);
  assign('model', payload.model);
  assign('manufacturer', payload.manufacturer);
  assign('osVersion', payload.osVersion);
  assign('metadata', payload.metadata);
  assign('lastIp', payload.lastIp);
  assign('geo', payload.geo);

  return record;
};

const recordToRow = (record: DeviceRecord) => ({
  device_id: record.deviceId,
  label: record.label ?? null,
  platform: record.platform,
  model: record.model ?? null,
  manufacturer: record.manufacturer ?? null,
  os_version: record.osVersion ?? null,
  tags: record.tags.length ? record.tags : [],
  metadata: record.metadata ?? null,
  status: record.status,
  last_ip: record.lastIp ?? null,
  geo_country: record.geo?.country ?? null,
  geo_city: record.geo?.city ?? null,
  geo_lat: record.geo?.lat ?? null,
  geo_lon: record.geo?.lon ?? null,
  created_at: record.createdAt,
  updated_at: record.updatedAt
});

export class DevicesRepository {
  constructor(private readonly db: Kysely<Database> | null) {}

  async list(status?: DeviceStatus): Promise<DeviceRecord[]> {
    if (!this.db) {
      const items = Array.from(memoryStore.values());
      return status ? items.filter((item) => item.status === status) : items;
    }

    let query = this.db.selectFrom('devices').selectAll();
    if (status) {
      query = query.where('status', '=', status);
    }
    const rows = await query.execute();
    return rows.map(toRecord);
  }

  async find(deviceId: string): Promise<DeviceRecord | undefined> {
    if (!this.db) {
      return memoryStore.get(deviceId);
    }

    const row = await this.db
      .selectFrom('devices')
      .selectAll()
      .where('device_id', '=', deviceId)
      .executeTakeFirst();

    return row ? toRecord(row) : undefined;
  }

  async upsert(payload: DeviceUpsertPayload): Promise<DeviceRecord> {
    const nowIso = new Date().toISOString();
    const existing = await this.find(payload.deviceId);
    const record = mergeRecord(payload, existing, nowIso);

    if (!this.db) {
      memoryStore.set(payload.deviceId, record);
      return record;
    }

    const row = recordToRow(record);

    const result = await this.db
      .insertInto('devices')
      .values(row)
      .onConflict((oc) =>
        oc.column('device_id').doUpdateSet({
          label: row.label,
          platform: row.platform,
          model: row.model,
          manufacturer: row.manufacturer,
          os_version: row.os_version,
          tags: row.tags,
          metadata: row.metadata,
          status: row.status,
          last_ip: row.last_ip,
          geo_country: row.geo_country,
          geo_city: row.geo_city,
          geo_lat: row.geo_lat,
          geo_lon: row.geo_lon,
          updated_at: row.updated_at
        })
      )
      .returningAll()
      .executeTakeFirstOrThrow();

    return toRecord(result);
  }

  async updateStatus(
    deviceId: string,
    payload: DeviceStatusUpdatePayload
  ): Promise<DeviceRecord | undefined> {
    const existing = await this.find(deviceId);
    if (!existing) return undefined;

    const updatedRecord: DeviceRecord = {
      ...existing,
      status: payload.status ?? existing.status,
      updatedAt: new Date().toISOString()
    };

    if (typeof payload.lastIp !== 'undefined') {
      updatedRecord.lastIp = payload.lastIp;
    }

    if (typeof payload.geo !== 'undefined') {
      updatedRecord.geo = payload.geo;
    }

    if (!this.db) {
      memoryStore.set(deviceId, updatedRecord);
      return updatedRecord;
    }

    const updated = await this.db
      .updateTable('devices')
      .set({
        status: updatedRecord.status,
        last_ip: updatedRecord.lastIp ?? null,
        geo_country: updatedRecord.geo?.country ?? null,
        geo_city: updatedRecord.geo?.city ?? null,
        geo_lat: updatedRecord.geo?.lat ?? null,
        geo_lon: updatedRecord.geo?.lon ?? null,
        updated_at: updatedRecord.updatedAt
      })
      .where('device_id', '=', deviceId)
      .returningAll()
      .executeTakeFirst();

    return updated ? toRecord(updated) : undefined;
  }
}

