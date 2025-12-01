import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import argon2 from 'argon2';
import { registerSchema, loginSchema } from './auth.schemas';
import { OperatorsRepository } from './auth.repository';

const authModule: FastifyPluginAsync = async (fastify) => {
  const repository = new OperatorsRepository(fastify.db);

  fastify.post('/register', async (request, reply) => {
    const existingCount = await repository.count();
    if (existingCount > 0) {
      reply.forbidden('Registration disabled once an operator exists.');
      return;
    }

    const payload = registerSchema.parse(request.body ?? {});
    const passwordHash = await argon2.hash(payload.password);
    const operator = await repository.createOperator({
      username: payload.username,
      passwordHash,
      role: payload.role ?? 'owner'
    });

    const token = fastify.jwt.sign({
      sub: operator.id.toString(),
      id: operator.id.toString(),
      role: operator.role
    });

    return {
      operator,
      token
    };
  });

  fastify.post('/login', async (request, reply) => {
    const payload = loginSchema.parse(request.body ?? {});
    const operator = await repository.findWithSecret(payload.username);
    if (!operator) {
      reply.unauthorized('Invalid credentials');
      return;
    }

    const passwordValid = await argon2.verify(operator.passwordHash, payload.password);
    if (!passwordValid) {
      reply.unauthorized('Invalid credentials');
      return;
    }

    if (!operator.isActive) {
      reply.forbidden('Operator disabled');
      return;
    }

    const token = fastify.jwt.sign({
      sub: operator.id.toString(),
      id: operator.id.toString(),
      role: operator.role
    });

    return {
      operator: {
        id: operator.id,
        username: operator.username,
        role: operator.role,
        isActive: operator.isActive,
        createdAt: operator.createdAt,
        updatedAt: operator.updatedAt
      },
      token
    };
  });

  fastify.get(
    '/profile',
    {
      preHandler: fastify.authenticate
    },
    async (request, reply) => {
      const operatorId = Number(request.user?.id);
      if (!operatorId) {
        reply.unauthorized();
        return;
      }

      const operator = await repository.findById(operatorId);
      if (!operator) {
        reply.notFound('Operator not found');
        return;
      }

      return operator;
    }
  );
};

export default fp(authModule, {
  name: 'auth-module',
  dependencies: ['auth-plugin']
});

