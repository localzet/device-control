import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

const coreModule: FastifyPluginAsync = async (fastify) => {
  fastify.get('/health', async () => ({
    status: 'ok',
    service: fastify.config.serviceName,
    environment: fastify.config.env,
    timestamp: new Date().toISOString()
  }));

  fastify.get('/meta', async () => ({
    service: fastify.config.serviceName,
    environment: fastify.config.env,
    version: process.env.npm_package_version ?? '0.0.0',
    documentation: '/docs'
  }));
};

export default fp(coreModule, {
  name: 'core-module'
});

