# Realtime Gateway

Socket.IO gateway service for Android client connections.

## Features

- Socket.IO server for real-time device communication
- Automatic device registration with control-api
- Health check endpoint
- Configurable CORS and logging

## Configuration

Copy `env.example` to `.env` and adjust:

- `GATEWAY_PORT`: Socket.IO server port (default: 22222)
- `CONTROL_API_URL`: URL of control-api service
- `LOG_LEVEL`: Logging level (fatal/error/warn/info/debug/trace/silent)

## Usage

```bash
npm run build
npm start
```

Or for development:

```bash
npm run dev
```

## Integration

This service:
1. Accepts Socket.IO connections from Android clients
2. Registers devices with control-api on connection
3. Updates device status on disconnect
4. Forwards commands and handles client responses

