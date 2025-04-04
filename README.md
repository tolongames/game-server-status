# Game Server Status Checker

A lightweight and efficient Node.js module to check the online status of popular game servers: **Minecraft Java**, **FiveM**, **CS:GO**, and **Rust**. Includes built-in caching, debug logging, and supports multiple servers at once.

## ✨ Features

- ✅ **Supports popular games**: Minecraft Java, FiveM, CS:GO, and Rust
- ⚡ **Built-in caching**: Avoid unnecessary requests with a 5-minute cache
- 🎯 **Custom options**: Force updates, select specific return fields
- 🔁 **Cyclical monitoring**: Ping servers on an interval
- 🐞 **Debug mode**: Enable with `DEBUG=true`

## 📦 Installation

```bash
npm install game-server-status
```

## 🚀 Usage

### 1. Check a Single Server

```javascript
const { getServerStatus } = require('game-server-status');

(async () => {
    const status = await getServerStatus('minecraft', '127.0.0.1', 25565);
    console.log(status);
})();
```

### 2. Check Multiple Servers at Once

```javascript
const { checkMultipleServers } = require('game-server-status');

const servers = [
    { game: 'minecraft', ip: '127.0.0.1', port: 25565 },
    { game: 'fivem', ip: '127.0.0.1', port: 30120 },
    { game: 'csgo', ip: '127.0.0.1', port: 27015 },
];

(async () => {
    const results = await checkMultipleServers(servers);
    console.log(results);
})();
```

### 3. Cyclical Monitoring

```javascript
const { pingServerCyclically } = require('game-server-status');

pingServerCyclically('minecraft', '127.0.0.1', 25565, 60000, (status) => {
    console.log('Server status:', status);
});
```

> This function will ping the server every 60 seconds and call your callback with the status.

## 🛠 Options

- `force` – Set to `true` to bypass the cache and get fresh data
- `select` – Return only selected keys (e.g., `['players', 'ping']`)
- `returnType` – Return only one specific value (e.g., `'players'`)

### Example with Options

```javascript
const status = await getServerStatus('fivem', '127.0.0.1', 30120, {
    force: true,
    select: ['players', 'serverName'],
});
console.log(status);
```

## 🎮 Supported Games

- **Minecraft Java**
- **FiveM**
- **CS:GO**
- **Rust**

## 🧠 Caching

This module uses in-memory caching (5 minutes by default) to improve performance. You can force a fresh check using the `force` option.

## 🐛 Debugging

Enable debug logging by setting the environment variable:

```bash
DEBUG=true node yourscript.js
```

## 📤 Example Responses

**Minecraft Java:**
```json
{
  "online": true,
  "message": "Server is online",
  "game": "Minecraft Java",
  "players": "12/20",
  "ping": 50,
  "serverName": "Minecraft Server",
  "version": "1.16.4"
}
```

**FiveM:**
```json
{
  "online": true,
  "data": { /* original /info.json response */ },
  "game": "FiveM",
  "players": 24,
  "maxPlayers": 32,
  "version": "1.0.0",
  "serverName": "FiveM Server",
  "ping": 40
}
```

## 📄 License

This project is licensed under the MIT License.