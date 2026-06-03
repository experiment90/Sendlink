const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));

// Track connected devices
const devices = new Map(); // ws -> device info

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function broadcast(data, excludeWs = null) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client !== excludeWs) {
      client.send(message);
    }
  });
}

function broadcastDeviceList() {
  const list = Array.from(devices.values()).map(d => ({
    id: d.id,
    name: d.name,
    type: d.type,
    connectedAt: d.connectedAt
  }));
  broadcast({ type: 'device_list', devices: list });
}

wss.on('connection', (ws, req) => {
  const deviceId = Math.random().toString(36).substr(2, 8);
  const ip = req.socket.remoteAddress;

  devices.set(ws, {
    id: deviceId,
    name: `Device ${deviceId.substring(0, 4).toUpperCase()}`,
    type: 'unknown',
    ip,
    connectedAt: new Date().toISOString()
  });

  // Send welcome
  ws.send(JSON.stringify({
    type: 'welcome',
    deviceId,
    message: 'Connected to SnapLink'
  }));

  broadcastDeviceList();

  ws.on('message', (raw) => {
    let data;
    try { data = JSON.parse(raw); } catch { return; }

    const device = devices.get(ws);

    switch (data.type) {
      case 'register':
        device.name = data.name || device.name;
        device.type = data.deviceType || 'desktop';
        broadcastDeviceList();
        break;

      case 'clipboard':
        // Broadcast clipboard to all other devices
        broadcast({
          type: 'clipboard',
          content: data.content,
          from: device.name,
          fromId: device.id,
          timestamp: new Date().toISOString()
        }, ws);
        break;

      case 'file':
        // Broadcast file to all other devices
        broadcast({
          type: 'file',
          name: data.name,
          mimeType: data.mimeType,
          data: data.data, // base64
          size: data.size,
          from: device.name,
          fromId: device.id,
          timestamp: new Date().toISOString()
        }, ws);
        break;

      case 'note':
        broadcast({
          type: 'note',
          content: data.content,
          from: device.name,
          fromId: device.id,
          timestamp: new Date().toISOString()
        }, ws);
        break;
    }
  });

  ws.on('close', () => {
    devices.delete(ws);
    broadcastDeviceList();
  });
});

const PORT = process.env.PORT || 4587;
server.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║           SnapLink is running        ║');
  console.log('╠══════════════════════════════════════╣');
  console.log(`║  Local:   http://localhost:${PORT}     ║`);
  console.log(`║  Network: http://${ip}:${PORT}  ║`);
  console.log('╠══════════════════════════════════════╣');
  console.log('║  Open on any device on your WiFi     ║');
  console.log('╚══════════════════════════════════════╝\n');
});
