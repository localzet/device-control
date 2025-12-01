# Device Control

> Enterprise Android Device Management and Monitoring Platform

Device Control is a comprehensive platform for remote management, monitoring, and administration of Android devices. Built with modern technologies, it provides a secure, scalable solution for enterprise device control and asset tracking.

### Features

- 🔒 **Discrete Operation** - Minimal system footprint, optimized for enterprise environments
- 📱 **Real-time Management** - Live device control and monitoring via web interface
- 🛡️ **Android 12+ Compatible** - Full support for latest Android versions
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- 📊 **Comprehensive Monitoring** - Device tracking, SMS monitoring, GPS location, file management, contacts, and more

### Quick Start

#### Using Docker (Recommended)

```bash
cd docker
docker-compose up -d
```

Access the web interface at http://localhost:22533

#### Manual Installation

```bash
npm install
node index.js
```

### Documentation

- [Installation Guide](docs/installation.md)
- [Quick Start](docs/quick-start.md)
- [Server Setup](docs/server.md)
- [APK Building](docs/app-factory/)
- [Docker Deployment](docker/README.md)
- [Roadmap](docs/ROADMAP.md)

### Architecture

```
├── server/          # Main server (Express + Socket.IO)
├── app/factory/     # Android APK build tools
├── platform/        # Next-gen modular services
└── docker/          # Docker deployment files
```

### Requirements

- Node.js 18+
- Java 17+ (for APK building)
- Android SDK (optional, for APK signing)

### License

MIT License - see [LICENSE](LICENSE) file

### Author

**localzet**

---

## Use Cases

- Enterprise device fleet management
- Corporate asset tracking and monitoring
- Employee device compliance monitoring
- Lost or stolen device recovery
- Remote device administration and support

