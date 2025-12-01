# Quick Start Guide

## Step 1: Configure Server URL in APK

```powershell
cd app/factory
.\configure-server-url.ps1 -AutoDetect
```

This automatically detects your computer's IP and configures the APK to connect to it.

**Or manually:**
```powershell
.\configure-server-url.ps1 -ServerUrl "http://192.168.1.100:22222"
```

## Step 2: Build APK

```powershell
.\check-and-rebuild.ps1
```

## Step 3: Install on Device

```powershell
.\test-device.ps1
```

## Step 4: Start Server

```powershell
cd ..\..
.\scripts\start-server.ps1
```

Or from project root:
```powershell
.\scripts\start-server.ps1
```

Or manually:
```bash
npm install
node index.js
```

## Step 5: Open Control Panel

Open in browser:
- **Locally**: http://localhost:22533
- **On network**: http://YOUR_IP:22533

## How It Works

1. **Server** (`index.js`) runs on ports:
   - 22533 - Web interface
   - 22222 - Socket.IO for clients

2. **APK** connects to server via Socket.IO on port 22222

3. **Web interface** shows all connected devices and allows management

## Verify Connection

After installing APK and starting server:
1. Device should appear in the list on the main page
2. You can open the device and manage it through the web interface

## Troubleshooting

### Device Not Appearing

1. Check that server is running
2. Check that URL in APK is correct (see step 1)
3. Check firewall - port 22222 must be open
4. Ensure device and server are on the same network

### Cannot Open Web Interface

1. Check that server is running
2. Check port 22533 - is it occupied?
3. Try http://127.0.0.1:22533

### Client Not Connecting

1. Check server logs
2. Check MainService on device:
   ```bash
   adb shell ps | grep devicecontrol
   ```
3. Check URL in APK - must match server IP

