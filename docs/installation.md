# Installation Guide

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- Java 17+ (for APK building)
- Docker & Docker Compose (optional, for containerized deployment)

## Installation Methods

### Method 1: Docker (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/localzet/device-control.git
cd device-control
```

2. Start the server:
```bash
cd docker
docker-compose up -d
```

3. Access the web interface at http://localhost:22533

### Method 2: Manual Installation

1. Clone the repository:
```bash
git clone https://github.com/localzet/device-control.git
cd device-control
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Access the web interface at http://localhost:22533

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=production
WEB_PORT=22533
CONTROL_PORT=22222
```

### Port Configuration

Default ports:
- **22533** - Web interface (HTTP)
- **22222** - Socket.IO for device connections

To change ports, edit `includes/const.js`:

```javascript
exports.web_port = 22533;
exports.control_port = 22222;
```

## Building Android Client

See [APK Building Guide](app-factory/README.md) for detailed instructions.

Quick build:
```bash
cd scripts/app-factory
.\configure-server-url.ps1 -AutoDetect
.\check-and-rebuild.ps1
```

## Production Deployment

### Using Docker

1. Configure environment variables
2. Set up reverse proxy (nginx/traefik) for HTTPS
3. Configure firewall rules
4. Set up SSL certificates

### Manual Deployment

1. Use process manager (PM2, systemd):
```bash
pm2 start index.js --name device-control
```

2. Set up reverse proxy
3. Configure firewall
4. Enable auto-start on boot

## Troubleshooting

### Port Already in Use

Change ports in `includes/const.js` or stop the conflicting service.

### Cannot Connect Devices

1. Check firewall settings
2. Verify server URL in APK
3. Ensure devices are on the same network
4. Check server logs for errors

### Docker Issues

See [Docker README](../docker/README.md) for troubleshooting.

## Next Steps

- [Quick Start Guide](quick-start.md)
- [Server Configuration](server.md)
- [APK Building](app-factory/)

