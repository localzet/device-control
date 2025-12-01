import fp from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import type { Database } from '../database/schema';

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<Database> | null;
  }
}

const databasePlugin: FastifyPluginAsync = async (fastify) => {
  const connectionString = fastify.config.databaseUrl;

  if (!connectionString) {
    fastify.log.warn(
      'DATABASE_URL is not set – persistence features will use in-memory fallbacks'
    );
    fastify.decorate('db', null);
    return;
  }

  const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000
  });

  const dialect = new PostgresDialect({ pool });
  const db = new Kysely<Database>({ dialect });

  fastify.decorate('db', db);

  fastify.addHook('onClose', async () => {
    await db.destroy();
    await pool.end();
  });

  fastify.log.info('Database connection pool initialized');
};

export default fp(databasePlugin, {
  name: 'database-plugin',
  dependencies: ['config-plugin']
});

