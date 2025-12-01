import { Server as SocketIOServer } from 'socket.io';
import { createServer } from 'http';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { loadConfig } from './config';
import { setupDeviceHandlers } from './handlers/device.handler';

const config = loadConfig();

const httpServer = createServer();
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.enableCors ? '*' : false,
    credentials: true
  },
  pingInterval: 30000,
  pingTimeout: 60000
});

const fastify = Fastify({
  logger: {
    level: config.logLevel,
    transport:
      config.env !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard'
            }
          }
        : undefined
  }
});

if (config.enableCors) {
  fastify.register(cors, {
    origin: true,
    credentials: true
  });
}

// Health check endpoint
fastify.get('/health', async () => {
  return { status: 'ok', service: config.serviceName };
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  fastify.log.info(`Client connected: ${socket.id}`);

  socket.emit('welcome');

  const clientParams = socket.handshake.query;
  const clientAddress = socket.request.socket.remoteAddress;
  const clientIP = clientAddress?.split(':').pop() || 'unknown';

  setupDeviceHandlers(socket, clientParams, clientIP, config, fastify.log);

  socket.on('disconnect', (reason) => {
    fastify.log.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
  });
});

const start = async () => {
  try {
    await fastify.listen({ port: config.port + 1, host: config.host });
    fastify.log.info(`HTTP server listening on ${config.host}:${config.port + 1}`);

    httpServer.listen(config.port, config.host, () => {
      fastify.log.info(
        `Socket.IO gateway listening on ${config.host}:${config.port}`
      );
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

if (require.main === module) {
  start();
}

export { io, fastify };

