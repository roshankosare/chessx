const { execSync } = require("child_process");
const fs = require("fs");

// Detect OS
const isWindows = process.platform === "win32";

// Get local IP
let ip;
try {
    if (isWindows) {
        ip = execSync(`powershell "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -like 'Wi-Fi*'}).IPAddress"`, { encoding: "utf-8" }).trim();
    } else {
        ip = execSync(`ip a | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d'/' -f1`, { encoding: "utf-8" }).trim();
    }
} catch (error) {
    console.error("Error getting local IP:", error);
    process.exit(1);
}

console.log(`🌍 Local IP: ${ip}`);

// Update .env file
const envFilePathClient = "./client/.env.local";
const envFilePathServer = "./server/.env.local";
let envContent = `VITE_SERVER_URL=http://${ip}\n`;

fs.writeFileSync(envFilePathClient, envContent);
fs.writeFileSync(envFilePathServer, envContent);
console.log("✅ .env file updated!");

// Done
