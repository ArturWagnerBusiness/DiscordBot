import { Message, MessageEmbed } from "discord.js";
import { CONFIG } from "./config";
import { Bot } from "./types";
import {
  getUserWaitText,
  isUserWait,
  randomFile,
  saveData,
  setUserWait,
  traverseFolders,
} from "./util";
var cache: Bot.Cache = {
  images: {},
  music: {},
  audioChannels: {},
  startUpTime: Date.now(),
  lastCacheRefresh: Date.now(),
};
function playAudio(channelID: string) {
  var room = cache.audioChannels[channelID];
  if (!room) return;
  let music = randomFile(room.library, ["mp3"]);
  if (!music) return;
  let dispatcher = room.channel.play(music, {
    volume: 0.4,
  });
  dispatcher.on("start", () => {
    if (!room) return;
    room.song = music ? music.replace(room.rootPath, "") : "";
    let timeNow = new Date().toLocaleTimeString();
    console.log(`[${timeNow}] Playing: ${room.rootPath}${room.song}`);
    saveData("log.txt", `[${timeNow}] Playing: ${room.rootPath}${room.song}`);
  });
  dispatcher.on("finish", () => {
    playAudio(channelID);
  });
}
export function refreshFileCache() {
  let startSize = 0;
  CONFIG.images.forEach((item) => {
    if (cache.images[item.command] === undefined) return;
    startSize += cache.images[item.command].length;
  });
  CONFIG.music.forEach((item) => {
    if (cache.music[item.category] === undefined) return;
    startSize += cache.music[item.category].length;
  });
  let endSize = 0;
  cache.lastCacheRefresh =
    Date.now() + 1000 * CONFIG.commandOptions.cacheWaitTime; // Non-admin can refresh every 30min
  CONFIG.images.forEach((image) => {
    cache.images[image.command] = traverseFolders(image.path);
    endSize += cache.images[image.command].length;
  });
  CONFIG.music.forEach((music) => {
    cache.music[music.category] = traverseFolders(music.path);
    endSize += cache.music[music.category].length;
  });
  return endSize - startSize;
}
export async function botMessageParse(message: Message) {
  if (!message.content.startsWith(CONFIG.commandSuffix)) return;
  const [COMMAND, ...PARAMS] = message.content.substring(1).split(" ");
  let timeNow = new Date().toLocaleTimeString();
  console.log(
    `[${timeNow}] Command ${message.author.username}: ${COMMAND} ${PARAMS.join(
      " "
    )}`
  );
  saveData(
    "log.txt",
    `[${timeNow}] Command ${message.author.username}: ${COMMAND} ${PARAMS.join(
      " "
    )}`
  );
  // Check each image commands
  CONFIG.images.forEach((image) => {
    if (image.command !== COMMAND) return; // Skip if not the command
    var search: string[] = [];
    if (PARAMS.length > 0) {
      CONFIG.imageFilters?.forEach((filter) => {
        if (filter.name === PARAMS[0]) search = filter.extensions;
      });
      if (search.length === 0) {
        (image.directMessage ? message.author : message.channel).send(
          CONFIG.templateMessages.imageInvalidParam
        );
        return;
      }
    }
    if (!isUserWait(message.author.id, image.command)) {
      var file = randomFile(cache["images"][image.command], search);
      if (file) {
        let timeNow = new Date().toLocaleTimeString();
        console.log(`[${timeNow}]       ^: ${file} `);
        saveData("log.txt", `[${timeNow}]       ^: ${file} `);
        (image.directMessage ? message.author : message.channel).send(
          CONFIG.templateMessages.imageSendSource.replace(
            "<file>",
            (image.spoiler ? "||" : "") +
              file?.replace(image.path, "") +
              (image.spoiler ? "||" : "")
          ),
          {
            files: [
              {
                attachment: file,
                name: image.spoiler
                  ? `SPOILER_FILE.${file.split(".").pop()}`
                  : file.split("/").pop(),
              },
            ],
          }
        );
      } else {
        (image.directMessage ? message.author : message.channel).send(
          CONFIG.templateMessages.imageSendFail
        );
      }
      setUserWait(message.author.id, image.waitTime, image.command);
    } else {
      (image.directMessage ? message.author : message.channel).send(
        CONFIG.templateMessages.imageSendWait.replace(
          "<time>",
          getUserWaitText(message.author.id, image.command)
        )
      );
    }
    if (image.cleanupMessage) {
      message.delete().catch(() => {}); // Try to delete.
    }
  });
  switch (COMMAND) {
    case CONFIG.actionCommands.joinChannel.command:
      if (!message.member?.voice.channel) break;
      cache.audioChannels[message.member?.voice.channel.id] = {
        channel: await message.member.voice.channel.join(),
        song: "",
        library: [],
        rootPath: "",
      };
      break;
    case CONFIG.actionCommands.leaveChannel.command: {
      if (!message.member?.voice.channel) break;
      let room = cache.audioChannels[message.member.voice.channel.id];
      if (!room) break;
      room.channel.disconnect();
      cache.audioChannels[message.member.voice.channel.id] = undefined;
      break;
    }
    case CONFIG.actionCommands.audioStart.command: {
      if (!message.member?.voice.channel) break;
      let room = cache.audioChannels[message.member.voice.channel.id];
      if (!room) break;
      if (PARAMS.length > 0) {
        var library: string[] = [];
        var rootPath = "";
        CONFIG.music.forEach((music) => {
          if (PARAMS[0] === music.category) {
            library = cache.music[PARAMS[0]];
            rootPath = music.path;
          }
        });
        if (library.length > 0) {
          room.library = library;
          room.rootPath = rootPath;
          playAudio(message.member.voice.channel.id);
        } else {
          message.channel.send(CONFIG.templateMessages.songInvalidParam);
        }
      } else {
        room.library = cache.music[CONFIG.music[0].category];
        room.rootPath = CONFIG.music[0].path;
        playAudio(message.member.voice.channel.id);
      }
      break;
    }
    case CONFIG.actionCommands.audioSkip.command: {
      if (!message.member?.voice.channel) break;
      let room = cache.audioChannels[message.member.voice.channel.id];
      if (!room) break;
      if (room.song === "") {
        message.channel.send(
          CONFIG.templateMessages.songNotPlaying.replace(
            "<command>",
            CONFIG.commandSuffix + CONFIG.actionCommands.audioStart.command
          )
        );
        break;
      }
      playAudio(message.member.voice.channel.id);
      break;
    }
    case CONFIG.actionCommands.audioName.command: {
      if (!message.member?.voice.channel) break;
      let room = cache.audioChannels[message.member.voice.channel.id];
      if (!room) break;
      message.channel.send(
        CONFIG.templateMessages.currentSongPlaying.replace(
          "<song>",
          room.song.replace(room.rootPath, "")
        )
      );
      break;
    }
    case CONFIG.actionCommands.helpPanel.command: {
      let imageCommands = "";
      CONFIG.images.forEach((image) => {
        imageCommands +=
          CONFIG.helpWindow.imageCommandSyntax
            .replace("<command>", CONFIG.commandSuffix + image.command)
            .replace("<description>", image.description) + "\n";
      });
      let imageFilters = "";
      CONFIG.imageFilters?.forEach((image) => {
        imageFilters += image.name + " ";
      });
      if (imageFilters !== "") {
        imageCommands +=
          CONFIG.helpWindow.imageCommandSyntax
            .replace("<command>", "Parameters")
            .replace("<description>", imageFilters) + "\n";
      }
      let musicCommands = "";
      [
        CONFIG.actionCommands.joinChannel,
        CONFIG.actionCommands.leaveChannel,
        CONFIG.actionCommands.audioName,
        CONFIG.actionCommands.audioSkip,
        CONFIG.actionCommands.audioStart,
      ].forEach((entity) => {
        musicCommands +=
          CONFIG.helpWindow.musicCommandSyntax
            .replace("<command>", CONFIG.commandSuffix + entity.command)
            .replace("<description>", entity.description) + "\n";
      });
      musicCommands += "**Music Groups:** ";
      CONFIG.music.forEach((music) => {
        musicCommands += `${music.category}, `;
      });
      let generalCommands = "";
      [
        CONFIG.actionCommands.helpPanel,
        CONFIG.actionCommands.stats,
        CONFIG.actionCommands.termOfService,
        CONFIG.actionCommands.donateLink,
        CONFIG.actionCommands.refreshFileCache,
      ].forEach((entity) => {
        generalCommands +=
          CONFIG.helpWindow.generalCommandSyntax
            .replace("<command>", CONFIG.commandSuffix + entity.command)
            .replace("<description>", entity.description) + "\n";
      });
      let exampleEmbed = new MessageEmbed()
        .setColor(CONFIG.helpWindow.color)
        .setTitle(CONFIG.helpWindow.title)
        .setDescription(CONFIG.helpWindow.description)
        .setAuthor(
          "Source code",
          undefined,
          "https://github.com/ArturWagnerBusiness/DiscordBot"
        )
        .addField(CONFIG.helpWindow.imageCommandTitle, imageCommands, true)
        .addField(CONFIG.helpWindow.musicCommandTitle, musicCommands, true)
        .addField(CONFIG.helpWindow.generalCommandTitle, generalCommands)
        .setFooter(CONFIG.helpWindow.footer);
      message.channel.send(exampleEmbed);
      break;
    }
    case CONFIG.actionCommands.stats.command: {
      let uptime = Math.floor((Date.now() - cache.startUpTime) / 1000);

      let images = "";
      CONFIG.images.forEach((image) => {
        images += `${image.command} - ${cache.images[image.command].length}\n`;
      });
      let musics = "";
      CONFIG.music.forEach((music) => {
        musics += `${music.category} - ${cache.music[music.category].length}`;
      });
      let exampleEmbed = new MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Bot Status")
        .setDescription(
          `Bot has been running for ${Math.floor(uptime / 3600) % 60}h ${
            Math.floor(uptime / 60) % 60
          }min ${uptime % 60}s`
        )
        .setAuthor(
          "Source code",
          undefined,
          "https://github.com/ArturWagnerBusiness/DiscordBot"
        )
        .addField("Images", images, true)
        .addField("Songs", musics, true)
        .setFooter(`Number of current admins: ${CONFIG.admins.length}`);
      message.channel.send(exampleEmbed);
      break;
    }
    case CONFIG.actionCommands.termOfService.command:
      message.channel.send(
        `You agree to keep yourself updated with any new changes to the tos in the source code. It can be viewed on the help panel at the top using ${
          CONFIG.commandSuffix + CONFIG.actionCommands.helpPanel
        }`
      );
      break;
    case CONFIG.actionCommands.donateLink.command:
      if (PARAMS[0] !== undefined) {
        saveData(
          "donate.txt",
          `${message.author.username}: ${PARAMS.join(" ")}`
        );
        message.channel.send(CONFIG.templateMessages.donateLinkSuccess);
      } else {
        message.channel.send(CONFIG.templateMessages.donateLinkFail);
      }
      break;
    case CONFIG.actionCommands.refreshFileCache.command:
      if (
        cache.lastCacheRefresh < Date.now() ||
        CONFIG.admins.includes(message.author.id)
      ) {
        let change = refreshFileCache();
        message.channel.send(
          CONFIG.templateMessages.cacheRefreshSuccess.replace(
            "<change>",
            (change >= 0 ? "+" : "") + change.toString()
          )
        );
      } else {
        let wait = Math.floor((cache.lastCacheRefresh - Date.now()) / 1000);
        message.channel.send(
          CONFIG.templateMessages.cacheRefreshFail.replace(
            "<time>",
            `${Math.floor(wait / 60)}min`
          )
        );
      }
  }
}
