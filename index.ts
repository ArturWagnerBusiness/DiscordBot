import { Client } from "discord.js";
import { botMessageParse, refreshFileCache } from "./bot";
import { CONFIG } from "./config";
import { TOKEN } from "./token";
// One line token file grab.
const client = new Client();

refreshFileCache();
client.on("ready", () => {
  console.log(`\nLogged in as ${client.user?.tag}!\n`);
  client.user?.setActivity(
    CONFIG.commandSuffix + CONFIG.actionCommands.helpPanel.command,
    { type: "LISTENING" }
  );
});

client.on("message", botMessageParse);

client.login(TOKEN);
