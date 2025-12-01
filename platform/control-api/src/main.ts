import Fastify, { type FastifyServerOptions } from 'fastify';
import fastifySensible from 'fastify-sensible';
import cors from '@fastify/cors';
import configPlugin from './plugins/config';
import databasePlugin from './plugins/database';
import authPlugin from './plugins/auth';
import coreModule from './modules/core/core.module';
import devicesModule from './modules/devices/devices.module';
import authModule from './modules/auth/auth.module';

export const buildServer = async () => {
  const loggerOptions: FastifyServerOptions['logger'] =
    process.env.NODE_ENV !== 'production'
      ? {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard'
            }
          }
        }
      : true;

  const server = Fastify({
    logger: loggerOptions
  });

  await server.register(configPlugin);
  await server.register(fastifySensible);
  await server.register(databasePlugin);
  await server.register(authPlugin);

  if (server.config.enableCors) {
    await server.register(cors, {
      origin: true,
      credentials: true
    });
  }

  await server.register(coreModule, { prefix: '/v1/core' });
  await server.register(authModule, { prefix: '/v1/auth' });
  await server.register(devicesModule, { prefix: '/v1/devices' });

  return server;
};

const start = async () => {
  const server = await buildServer();
  const { port, host } = server.config;

  try {
    await server.listen({ port, host });
    server.log.info(`control-api listening on ${host}:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

