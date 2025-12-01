import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import {
  deviceParamSchema,
  deviceQuerySchema,
  deviceStatusUpdateSchema,
  deviceUpsertSchema
} from './device.schemas';
import { DevicesRepository } from './device.repository';

const devicesModule: FastifyPluginAsync = async (fastify) => {
  const repository = new DevicesRepository(fastify.db);

  fastify.get('/', async (request) => {
    const query = deviceQuerySchema.parse(request.query ?? {});
    return repository.list(query.status);
  });

  fastify.post('/', async (request, reply) => {
    const payload = deviceUpsertSchema.parse(request.body ?? {});
    const record = await repository.upsert(payload);
    reply.code(record.createdAt === record.updatedAt ? 201 : 200);
    return record;
  });

  fastify.get('/:deviceId', async (request, reply) => {
    const params = deviceParamSchema.parse(request.params ?? {});
    const record = await repository.find(params.deviceId);

    if (!record) {
      reply.notFound('Device not found');
      return;
    }

    return record;
  });

  fastify.patch('/:deviceId/status', async (request, reply) => {
    const params = deviceParamSchema.parse(request.params ?? {});
    const body = deviceStatusUpdateSchema.parse(request.body ?? {});
    const updated = await repository.updateStatus(params.deviceId, body);

    if (!updated) {
      reply.notFound('Device not found');
      return;
    }

    return updated;
  });
};

export default fp(devicesModule, {
  name: 'devices-module',
  dependencies: ['database-plugin']
});

