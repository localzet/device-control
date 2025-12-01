# Server Configuration

## Overview

The server consists of:
- Express.js web server (port 22533)
- Socket.IO server (port 22222)
- Device management system
- Web interface

## Configuration

### Ports

Edit `includes/const.js`:

```javascript
exports.web_port = 22533;  // Web interface
exports.control_port = 22222; // Socket.IO
```

### Environment Variables

Create `.env` file:

```env
NODE_ENV=production
WEB_PORT=22533
CONTROL_PORT=22222
```

## Starting the Server

### Using Script

```powershell
.\scripts\start-server.ps1
```

### Manual

```bash
npm install
node index.js
```

### Using Docker

```bash
cd docker
docker-compose up -d
```

## Structure

```
index.js              - Main server
includes/
  ├── const.js        - Constants (ports, paths)
  ├── clientManager.js - Client management
  ├── databaseGateway.js - Database (lowdb)
  └── expressRoutes.js - Web interface routes
assets/
  └── views/          - EJS templates
```

## Verification

1. Start server
2. Install APK on device
3. Device should appear in web interface list
4. You can manage device through web interface

## Troubleshooting

### Port Already in Use

Change ports in `includes/const.js` or stop conflicting service.

### Client Not Connecting

1. Check that server is running
2. Check that URL in APK is correct
3. Check firewall - port 22222 must be open
4. Ensure device and server are on the same network

### No Devices in List

1. Check server logs
2. Check that MainService is running on device:
   ```bash
   adb shell ps | grep device-control
   ```

