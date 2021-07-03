import { Client } from "discord.js";
import {
  animeImagePaths,
  memeImagePaths,
  lewdImagePaths,
  admins,
} from "./config";
import { randomFile, checkUser, getWaitTime } from "./util";
// One line token file grab.
const token: string = require("./token.js");
const startUpTime = Date.now();
const client = new Client();
client.on("ready", () => {
  console.log(`\nLogged in as ${client.user?.tag}!\n`);
});

client.on("message", (message) => {
  let data = message.content.split(" ");
  const command = data.shift();
  const params = data.length > 0 ? [...data] : [];

  if (command === "?help") {
    message.channel.send(`**Possible Commands**
\`\`\`markdown
?meme  - Puts you on 7s wait queue.
?anime - Puts you on 7s wait queue.
?lewd  - Puts you on 1h wait queue. (Disabled for now, or?)
?stats- News & stats.
\`\`\`*By the way, you can message me in DM's as well!*`);
  }
  //! MEME COMMAND
  if (command === "?meme") {
    if (checkUser(message.author.id, 0.12, "meme")) {
      message.channel.send("", {
        files: [randomFile(memeImagePaths)],
      });
    } else {
      message.channel.send(
        `\`You need to wait ${getWaitTime(
          message.author.id,
          "meme"
        )} before getting a new meme.\``
      );
    }
    //! ANIME COMMAND
  } else if (command === "?anime") {
    if (checkUser(message.author.id, 0.12, "anime")) {
      message.channel.send("", {
        files: [randomFile(animeImagePaths)],
      });
    } else {
      message.channel.send(
        `\`You need to wait ${getWaitTime(
          message.author.id,
          "anime"
        )} before getting a new anime pic.\``
      );
    }
    //! LEWD COMMAND
  } else if (command === "?lewdpass") {
    if (checkUser(message.author.id, 60, "lewd")) {
      let lewd = randomFile(lewdImagePaths);
      if (admins.includes(message.author.id)) {
        console.log(`Lewd read,
By: ${message.author.username} (Admin)
File: ${lewd}\n`);
      } else {
        console.log(`***********************
LEWDS EXPOSED!
BY: ${message.author.username}
FILE: ${lewd}
***********************\n`);
      }
      message.channel.send("", {
        files: [lewd],
      });
    } else {
      message.channel.send(
        `\`Your wait shall last ${getWaitTime(
          message.author.id,
          "lewd"
        )} before you can obtain more lewd.\``
      );
    }
  } else if (command === "?stats") {
    let uptime = Math.floor((Date.now() - startUpTime) / 60000);
    message.channel.send(`**Current Stats**
\`\`\`markdown
Files:
Meme  - ${memeImagePaths.length}
Anime - ${animeImagePaths.length}
Lewd  - ${lewdImagePaths.length}
Total - ${
      memeImagePaths.length + animeImagePaths.length + lewdImagePaths.length
    }

Uptime: ${
      uptime > 60
        ? `${Math.floor(uptime / 60)} hour${
            Math.floor(uptime / 60) > 1 ? "s" : ""
          }`
        : `${uptime} minute${uptime > 1 ? "s" : ""}`
    } 
\`\`\``);
  }
});

client.login(token);
