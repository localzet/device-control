# Scripts Directory

This directory contains utility scripts for building, deploying, and managing the Device Control platform.

## Structure

```
scripts/
├── app-factory/     # Android APK build scripts
└── start-server.ps1 # Server startup script
```

## App Factory Scripts

All APK build scripts are located in `app-factory/` subdirectory. See [app-factory/README.md](app-factory/README.md) for details.

## Server Scripts

- `start-server.ps1` - Starts the Device Control server with automatic IP detection

## Usage

All scripts should be run from the project root directory:

```powershell
.\scripts\start-server.ps1
.\scripts\app-factory\configure-server-url.ps1 -AutoDetect
```

