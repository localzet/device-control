import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import crypto from 'crypto';
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify';
import type { OperatorRole } from '../database/schema';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      id: string;
      role: OperatorRole;
    };
    user: {
      sub: string;
      id: string;
      role: OperatorRole;
      iat: number;
      exp: number;
    };
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (roles?: OperatorRole[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const secret =
    fastify.config.jwtSecret ||
    crypto
      .createHash('sha256')
      .update(`${fastify.config.serviceName}-${Date.now()}-${Math.random()}`)
      .digest('hex');

  await fastify.register(jwt, {
    secret,
    sign: {
      expiresIn: fastify.config.jwtExpiresIn
    }
  });

  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.unauthorized();
    }
  });

  fastify.decorate(
    'authorize',
    (roles?: OperatorRole[]) => async (request: FastifyRequest, reply: FastifyReply) => {
      await fastify.authenticate(request, reply);
      if (!roles || roles.length === 0) return;

      const userRole = request.user?.role;
      if (!userRole || !roles.includes(userRole)) {
        reply.forbidden('Not enough privileges');
      }
    }
  );

  if (!fastify.config.jwtSecret) {
    fastify.log.warn('JWT_SECRET not provided, generated ephemeral secret (dev only).');
  }
};

export default fp(authPlugin, {
  name: 'auth-plugin',
  dependencies: ['config-plugin']
});

