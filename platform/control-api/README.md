## control-api

Foundational Fastify service that will power the next-generation operator experience. It exposes REST endpoints for health checks, device management, and (soon) authentication, automation, and integrations.

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the service with live reload via `ts-node-dev`. |
| `npm run build` | Compile TypeScript to `dist/`. |
| `npm start` | Run the compiled JavaScript (production mode). |

### Environment Variables

Create a local `.env` file based on `env.example`.

| Variable | Description | Default |
| --- | --- | --- |
| `SERVICE_NAME` | Logical name for logging/metrics. | `control-api` |
| `NODE_ENV` | `development`, `production`, or `test`. | `development` |
| `CONTROL_API_PORT` | HTTP port. | `4000` |
| `CONTROL_API_HOST` | Bind address. | `0.0.0.0` |
| `LOG_LEVEL` | Pino log level. | `info` |
| `ENABLE_CORS` | Whether to auto-enable permissive CORS in dev. | `true` |
| `JWT_SECRET` | Secret used to sign operator tokens. Auto-generated (insecure) if omitted. | _optional_ |
| `JWT_EXPIRES_IN` | Token TTL accepted by `@fastify/jwt`. | `1d` |
| `DATABASE_URL` | PostgreSQL connection string. When omitted the service falls back to in-memory stores (dev only). | _optional_ |

### API Preview

- `GET /v1/core/health` – readiness/liveness metadata.
- `GET /v1/core/meta` – build info for UI/ops tooling.
- `GET /v1/devices` – list registered devices (persists to PostgreSQL when `DATABASE_URL` is configured, otherwise uses an in-memory Map).
- `POST /v1/devices` – register/update device descriptors.
- `GET /v1/devices/:deviceId` – fetch a specific device.
- `PATCH /v1/devices/:deviceId/status` – adjust online/offline state.
- `POST /v1/auth/register` – bootstrap the very first operator (disabled once an operator exists).
- `POST /v1/auth/login` – authenticate and receive a JWT bearer token.
- `GET /v1/auth/profile` – fetch the authenticated operator profile (requires `Authorization: Bearer ...`).

### Persistence Layer

- `src/plugins/database.ts` wires a shared `Kysely<Database>` instance backed by `pg`. The pool is activated only when `DATABASE_URL` is present, allowing local hacking without PostgreSQL.
- `src/database/schema.ts` documents the canonical shape of the `devices` table (and future tables) for both TypeScript safety and migration tooling.
- `DevicesRepository` transparently falls back to an in-memory store when PostgreSQL is unavailable, so API responses remain deterministic in development environments.

> ℹ️ Migrations will be added in the next iteration (likely using Drizzle or Kysely’s companion tools). For now, create the `devices` table manually or run against the fallback store.

### Authentication & RBAC Preview

- The new `auth-plugin` wires `@fastify/jwt` with secrets sourced from environment variables (or a generated fallback for local hacking). Helper decorators `fastify.authenticate` and `fastify.authorize` make it easy to protect future routes.
- `auth-module` introduces bootstrap registration, login, and profile endpoints backed by the `operators` table (or a secure in-memory map when PostgreSQL is absent). Only the very first operator can be created anonymously, guaranteeing you can lock down the panel once onboarded.
- Passwords are hashed with Argon2, tokens include operator `role`, and the groundwork for multi-role policies (`owner`, `admin`, `analyst`) is in place for upcoming RBAC expansion.

