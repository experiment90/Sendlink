# SnapLink

**Instant clipboard, file & note sharing across all your devices — no accounts, no setup.**

Just run it on your laptop and open the URL on any device on the same WiFi.

---

## Setup (takes 2 minutes)

### 1. Install Node.js
If you don't have it: https://nodejs.org (download the LTS version)

### 2. Extract this folder anywhere on your laptop

### 3. Install dependencies
```bash
cd snaplink
npm install
```

### 4. Start SnapLink
```bash
npm start
```

You'll see something like:
```
╔══════════════════════════════════════╗
║           SnapLink is running        ║
╠══════════════════════════════════════╣
║  Local:   http://localhost:4587      ║
║  Network: http://192.168.1.42:4587   ║
╠══════════════════════════════════════╣
║  Open on any device on your WiFi     ║
╚══════════════════════════════════════╝
```

### 5. Open on your other devices
On your phone/tablet/other laptop, open a browser and go to:
```
http://192.168.1.42:4587
```
(use your actual Network IP shown in the terminal)

---

## What you can do

- **📋 Clipboard sync** — type or paste text, hit Send, it appears on all devices instantly
- **📁 File sharing** — drag & drop any file up to 50MB, download it on any device
- **🕒 History** — everything received is saved in the session

## Tips

- Press **Cmd+Enter** (Mac) or **Ctrl+Enter** (Windows) to send clipboard quickly
- All devices on the same WiFi network can connect
- Nothing is stored on the internet — everything is local to your network
- Restart the server to clear all history

---

## Coming next
- [ ] Persistent history across restarts
- [ ] End-to-end encryption
- [ ] QR code to join from phone
- [ ] Keyboard/mouse sharing (Barrier-style)
