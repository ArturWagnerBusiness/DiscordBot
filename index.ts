import { Client, VoiceConnection } from "discord.js";
import {
  animeImagePaths,
  memeImagePaths,
  lewdImagePaths,
  songsPaths,
  admins,
  animeImageRootFolder,
  memeImageRootFolder,
  lewdImageRootFolder,
  songsRootFolder,
} from "./config";
import {
  randomFile,
  checkUser,
  getWaitTime,
  saveData,
  generatePath,
} from "./util";
// One line token file grab.
const token: string = require("./token.js");
const startUpTime = Date.now();
const client = new Client();
var connection: VoiceConnection | undefined;
var currentSongName = "";

client.on("ready", () => {
  console.log(`\nLogged in as ${client.user?.tag}!\n`);
  client.user?.setActivity(`?help`, { type: "WATCHING" });
});

client.on("message", async (message) => {
  let data = message.content.split(" ");
  const command = data.shift();
  const params = data.length > 0 ? [...data] : [];
  //! HELP COMMAND
  if (command === "?help") {
    message.channel.send(`**Possible Commands**
\`\`\`markdown
# Images
?meme      - Selects a random meme (7s cdr).
?anime     - Selects a random anime pic (7s cdr).
?lewd      - Selects a random lewd (1h cdr).
?donate    - Send me a link of vid/png to add.
Params: -png -gif -mp4
E.g: ?meme -gif
# Music (Only in Server)
?leave     - Leave vc.
?join      - Join vc.
?play      - Selects random song from lib.
?skip      - Play next random song.
?song-name - Get current song name.
?song-db   - Get a link to the song folder.
# Info
?help      - This menu.
?stats     - News & stats.
?tos       - Term of service.
TIP: I also answer commands in direct messages!
Source Code: https://github.com/ArturWagnerBusiness/DiscordBot
\`\`\``);
    //! MEME COMMAND
  } else if (command === "?meme") {
    if (checkUser(message.author.id, 0, "meme")) {
      if (params.length > 0) {
        var file;
        switch (params[0]) {
          case "-png":
            file = randomFile(memeImagePaths, "png");
            break;
          case "-gif":
            file = randomFile(memeImagePaths, "gif");
            break;
          case "-mp4":
            file = randomFile(memeImagePaths, "mp4");
            break;
        }
        if (file) {
          message.channel
            .send("Source: " + generatePath(file, memeImageRootFolder), {
              files: [file],
            })
            .catch(() => {
              message.channel.send(
                "`Error: Was unable to send a file. Please try again.`"
              );
            });
        } else {
          message.channel.send(`\`No meme found with "${params[0]}"\``);
        }
      } else {
        let file = randomFile(memeImagePaths, "all");
        if (file) {
          message.channel.send(
            "Source: " + generatePath(file, memeImageRootFolder),
            {
              files: [file],
            }
          );
        } else {
          message.channel.send("`Could not find meme`");
        }
      }
    } else {
      message.channel.send(
        `You need to wait ${getWaitTime(
          message.author.id,
          "meme"
        )} before getting a new meme.`
      );
    }
    //! ANIME COMMAND
  } else if (command === "?anime") {
    if (checkUser(message.author.id, 0, "anime")) {
      if (params.length > 0) {
        var file;
        switch (params[0]) {
          case "-png":
            file = randomFile(animeImagePaths, "png");
            break;
          case "-gif":
            file = randomFile(animeImagePaths, "gif");
            break;
          case "-mp4":
            file = randomFile(animeImagePaths, "mp4");
            break;
        }
        if (file) {
          message.channel
            .send("Source: " + generatePath(file, animeImageRootFolder), {
              files: [file],
            })
            .catch(() => {
              message.channel.send(
                `Error: Was unable to send a file. Please try again.`
              );
            });
        } else {
          message.channel.send(`No anime pic found with "${params[0]}"`);
        }
      } else {
        let file = randomFile(animeImagePaths, "all");
        if (file) {
          message.channel.send(
            "Source: " + generatePath(file, animeImageRootFolder),
            {
              files: [file],
            }
          );
        } else {
          message.channel.send("`Could not find anime pic`");
        }
      }
    } else {
      message.channel.send(
        `You need to wait ${getWaitTime(
          message.author.id,
          "anime"
        )} before getting a new anime pic.`
      );
    }
    //! LEWD COMMAND
  } else if (command === "?lewd") {
    message.delete().catch(() => {
      console.log("Cannot delete message in dm's (from ?lewdpass)");
    });
    if (checkUser(message.author.id, 30, "lewd")) {
      let lewd = randomFile(lewdImagePaths, "all");
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
      saveData("log.txt", `LEWD ${message.author.username}: ${lewd}`);
      if (lewd) {
        message.author.send(
          "By viewing the image you agree to TOS in ?tos\nSource: ||" +
            generatePath(lewd, lewdImageRootFolder) +
            "||",
          {
            files: [
              {
                attachment: lewd,
                name: `SPOILER_FILE.${lewd.split(".").pop()}`,
              },
            ],
          }
        );
      } else {
        message.author.send("`Could not find lewds`");
      }
    } else {
      message.author.send(
        `Your wait shall last ${getWaitTime(
          message.author.id,
          "lewd"
        )} before you can obtain more lewd.`
      );
    }
    //! STATS COMMAND
  } else if (command === "?stats") {
    let uptime = Math.floor((Date.now() - startUpTime) / 60000);
    message.channel.send(`**Current Stats**
\`\`\`markdown
Files:
Meme   - ${memeImagePaths.length}
Anime  - ${animeImagePaths.length}
Lewd   - ${lewdImagePaths.length}
Total  - ${
      memeImagePaths.length + animeImagePaths.length + lewdImagePaths.length
    }

Songs  - ${songsPaths.length}

Admins - ${admins.length}

Uptime: ${
      uptime > 60
        ? `${Math.floor(uptime / 60)} hour${
            Math.floor(uptime / 60) > 1 ? "s" : ""
          }`
        : `${uptime} minute${uptime > 1 ? "s" : ""}`
    } 
\`\`\``);
    //! JOIN COMMAND
  } else if (command === "?join") {
    if (message.member?.voice.channel) {
      connection = await message.member.voice.channel.join();
    }
    //! LEAVE COMMAND
  } else if (command === "?leave" && connection) {
    connection.disconnect();
    connection = undefined;
    currentSongName = "";
    //! PLAY COMMAND
  } else if (
    (command === "?play" && connection) ||
    (command === "?skip" && connection)
  ) {
    playRandomSong();
    //! DONATE COMMAND
  } else if (command === "?donate" && params.length > 0) {
    let out = "";
    params.forEach((param) => {
      out += param + " ";
    });
    message.author.send(`Donation saved! Thank you!`);
    saveData("donate.txt", `${message.author.username}: ${out}`);
    //! TOS COMMAND
  } else if (command === "?tos") {
    message.author.send(`**Term of Service**
\`\`\`markdown
By using the bot you agree that your soul in my.
Any data provided to you by the bot is by no means connected to the bot owner.
Please keep in mind that the bot owner is not responsible for any damage caused.
You are free to use the bot otherwise.
\`\`\``);
    saveData("log.txt", `TOS READ ${message.author.username}`);
    //! SONG-NAME COMMAND
  } else if (command === "?song-name" && connection && currentSongName) {
    message.channel.send(
      `Current song playing is ${generatePath(
        currentSongName,
        songsRootFolder
      )}`
    );
    //! SONG-DATABASE COMMAND
  } else if (command === "?song-db") {
    message.author.send(
      `Here is the link, you agree to ?tos by using the link. ||https://drive.google.com/drive/folders/1mPSTX-7uEi0bGyW8PUa1g7uFRFMtKWIc?usp=sharing||`
    );
    saveData("log.txt", `SONG-DB request ${message.author.username}`);
  }
});

function playRandomSong() {
  if (!connection) return;
  let file = randomFile(songsPaths, "all");
  if (!file) return;
  let dispatcher = connection.play(file, { volume: 0.4 });
  dispatcher.on("start", () => {
    currentSongName = file ? file : "";
  });
  dispatcher.on("finish", () => {
    currentSongName = "";
    playRandomSong();
  });
  dispatcher.on("error", console.error);
}

client.login(token);
