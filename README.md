
# Game Server Status Checker

A powerful and efficient Node.js package to check the online status of popular game servers like Minecraft, FiveM, CS:GO, and Rust. This package provides easy-to-use functions to monitor the health of your game servers, cache the results for faster performance, and handle multiple servers at once.

## Features

- **Support for multiple games**: Monitor servers for Minecraft Java, FiveM, CS:GO, and Rust.
- **Caching**: Automatically caches server status for 5 minutes to reduce the number of requests.
- **Customizable options**: You can select specific data to return (e.g., number of players) and define return types.
- **Force update**: Option to force a fresh status check and bypass cache.
- **Interval monitoring**: Check server status on a cyclical basis at a set interval.

## Installation

To install the package, use npm:

```bash
npm install game-server-status-checker
```

## Usage

### 1. Check a Single Server Status

To check the status of a single server, use the `getServerStatus` function. Provide the game, IP address, and port.

```javascript
const { getServerStatus } = require('game-server-status-checker');

(async () => {
    const serverStatus = await getServerStatus('minecraft', '127.0.0.1', 25565);
    console.log(serverStatus);
})();
```

This function will return a structured object with the server status, players online, server name, version, and ping.

### 2. Check Multiple Servers

You can also check the status of multiple servers at once using `checkMultipleServers`.

```javascript
const { checkMultipleServers } = require('game-server-status-checker');

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

This will return an array of server statuses for all the specified servers.

### 3. Cyclical Server Status Check

If you want to continuously monitor a server, you can use `pingServerCyclically`.

```javascript
const { pingServerCyclically } = require('game-server-status-checker');

pingServerCyclically('minecraft', '127.0.0.1', 25565, 60000, (status) => {
    console.log('Server status:', status);
});
```

This will check the server status every 60 seconds and call the provided callback with the status.

## Options

- `force`: If set to `true`, the cache will be bypassed, and the server status will be fetched anew.
- `select`: An array of keys to filter the response and return only selected data.
- `returnType`: A specific field to return, such as the number of players or ping.

### Example with options:

```javascript
const status = await getServerStatus('minecraft', '127.0.0.1', 25565, {
    force: true, 
    select: ['players', 'ping'],
});
console.log(status);
```

## Supported Games

- **Minecraft Java**
- **FiveM**
- **CS:GO**
- **Rust**

## Caching

By default, the status of each server is cached for 5 minutes. If the same request is made within that time frame, the cached result is returned. To force a fresh request, set `force: true`.

## Debugging

If you want to enable debug logging, set the `DEBUG` environment variable to `true` before running the script:

```bash
DEBUG=true node yourscript.js
```

## Example Response

For a Minecraft Java server, the response may look like this:

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

For a FiveM server:

```json
{
    "online": true,
    "data": { ... },
    "game": "FiveM",
    "players": 24,
    "maxPlayers": 32,
    "version": "1.0.0",
    "serverName": "FiveM Server",
    "ping": 40
}
```

## License

This project is licensed under the MIT License.

## Contributions

<<<<<<< HEAD
Contributions are welcome! If you find any bugs or want to suggest a feature, feel free to open an issue or submit a pull request.
=======
Contributions are welcome! If you find any bugs or want to suggest a feature, feel free to open an issue or submit a pull request.
>>>>>>> 0bd3d9f84910b024b69284b2be485988f41d0e6b
