import fp from 'fastify-plugin';
import { loadConfig, type ServiceConfig } from '../config';

declare module 'fastify' {
  interface FastifyInstance {
    config: ServiceConfig;
  }
}

const configPlugin = fp(async (fastify) => {
  const serviceConfig = loadConfig();
  fastify.decorate('config', serviceConfig);

  fastify.log.info(
    {
      env: serviceConfig.env,
      serviceName: serviceConfig.serviceName,
      port: serviceConfig.port
    },
    'configuration applied'
  );
}, { name: 'config-plugin' });

export default configPlugin;

