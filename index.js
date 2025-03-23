const dgram = require("dgram");
const axios = require("axios");
const NodeCache = require("node-cache");

const cache = new NodeCache({ stdTTL: 300, checkperiod: 320 });

function log(message) {
    if (process.env.DEBUG === "true") {
        console.log(`[DEBUG] ${message}`);
    }
}

async function checkMinecraftJava(ip, port = 25565) {
    log(`Checking Minecraft server at ${ip}:${port}`);
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket("udp4");

        // Ustawienie timeoutu, aby uniknąć nieskończonego oczekiwania
        const timeout = setTimeout(() => {
            resolve({
                online: false,
                message: "Server is offline",
                game: "Minecraft Java"
            });
            client.close();
        }, 5000); // Timeout po 5 sekundach

        client.on("message", (msg) => {
            clearTimeout(timeout); // Usuwanie timeoutu, gdy otrzymano wiadomość
            resolve({
                online: true,
                message: "Server is online",
                game: "Minecraft Java",
                players: msg.toString(),
                ping: 50,
                serverName: "Minecraft Server",
                version: "1.16.4"
            });
            client.close();
        });

        client.on("error", (err) => {
            clearTimeout(timeout); // Usuwanie timeoutu w przypadku błędu
            resolve({
                online: false,
                message: "Server is offline",
                game: "Minecraft Java"
            });
            client.close();
        });

        // Wysyłanie zapytania do serwera Minecraft
        client.send(Buffer.from([0xFE, 0x01]), port, ip);
    });
}


async function checkFiveM(ip, port = 30120) {
    log(`Checking FiveM server at ${ip}:${port}`);
    try {
        const url = `http://${ip}:${port}/info.json`;
        const response = await axios.get(url, { timeout: 3000 });
        if (response.status === 200) {
            return {
                online: true,
                data: response.data,
                game: "FiveM",
                players: response.data.players.online,
                maxPlayers: response.data.sv_maxclients,
                version: response.data.version,
                serverName: response.data.hostname,
                ping: response.data.ping
            };
        }
    } catch (err) {
        log(`Error checking FiveM server: ${err.message}`);
    }
    return { online: false, message: "Server is offline", game: "FiveM" };
}

async function checkCSGO(ip, port = 27015) {
    log(`Checking CS:GO server at ${ip}:${port}`);
    try {
        const url = `http://${ip}:${port}/status`;
        const response = await axios.get(url, { timeout: 3000 });
        if (response.status === 200) {
            return {
                online: true,
                data: response.data,
                game: "CS:GO",
                players: response.data.players,
                maxPlayers: 64,
                ping: response.data.ping,
                serverName: response.data.serverName,
                version: response.data.version
            };
        }
    } catch (err) {
        log(`Error checking CS:GO server: ${err.message}`);
    }
    return { online: false, message: "Server is offline", game: "CS:GO" };
}

async function checkRust(ip, port = 28015) {
    log(`Checking Rust server at ${ip}:${port}`);
    try {
        const url = `http://${ip}:${port}/status`;
        const response = await axios.get(url, { timeout: 3000 });
        if (response.status === 200) {
            return {
                online: true,
                data: response.data,
                game: "Rust",
                players: response.data.players,
                maxPlayers: 100,
                ping: response.data.ping,
                serverName: response.data.hostname,
                version: response.data.version
            };
        }
    } catch (err) {
        log(`Error checking Rust server: ${err.message}`);
    }
    return { online: false, message: "Server is offline", game: "Rust" };
}

async function getServerStatus(game, ip, port, options = {}) {
    if (!ip || !game) {
        throw new Error("Missing required parameters");
    }

    const cacheKey = `${game}-${ip}-${port || ""}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData && !options.force) {
        log("Returning cached data...");
        return cachedData;
    }

    let result;
    if (game === "minecraft") {
        result = await checkMinecraftJava(ip, port || 25565);
    } else if (game === "fivem") {
        result = await checkFiveM(ip, port || 30120);
    } else if (game === "csgo") {
        result = await checkCSGO(ip, port || 27015);
    } else if (game === "rust") {
        result = await checkRust(ip, port || 28015);
    } else {
        throw new Error("Unsupported game");
    }

    cache.set(cacheKey, result);

    if (options.select) {
        const selectedData = {};
        options.select.forEach((key) => {
            if (result[key] !== undefined) {
                selectedData[key] = result[key];
            }
        });
        return selectedData;
    }

    if (options.returnType) {
        const returnType = options.returnType;
        if (result[returnType] !== undefined) {
            return result[returnType];
        } else {
            throw new Error(`Requested field ${returnType} is not available`);
        }
    }

    return result;
}

async function checkMultipleServers(servers, options = {}) {
    const results = [];
    for (const server of servers) {
        const { game, ip, port } = server;
        const status = await getServerStatus(game, ip, port, options);
        results.push({ ip, status });
    }
    return results;
}

function pingServerCyclically(game, ip, port, interval, callback) {
    setInterval(async () => {
        const status = await getServerStatus(game, ip, port);
        callback(status);
    }, interval);
}

module.exports = { getServerStatus, checkMultipleServers, pingServerCyclically };
