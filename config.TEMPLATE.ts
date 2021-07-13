import { Bot } from "./types";

export const CONFIG: Bot.Config = {
  /*
  Get your id by right clicking yourself and clicking copy id,
  you must have developer mode enabled on discord.
  Put the id in admins as so ["000000000000000000"]
  */
  admins: [],
  commandSuffix: "?",
  images: [
    /*{
        command: Direct command name
        description: Description of the command shown in help panel
        path: directory which files live
        waitTime: Time which the user has to wait in seconds
        spoiler: Hides the source text and image using a spoiler tag
        directMessage: Sends image into users direct messages
        cleanupMessage: Tries to delete the user command message after it is send
    }*/
    {
      command: "meme",
      description: "Selects a random meme",
      path: "/home/user/image/meme",
      waitTime: 0,
    },
    {
      command: "anime",
      description: "Selects a random anime",
      path: "/home/user/image/anime",
      waitTime: 0,
    },
  ],
  imageFilters: [
    { name: "img", extensions: ["png", "jpg", "jpeg"] },
    { name: "gif", extensions: ["gif"] },
    { name: "vid", extensions: ["mp4", "mov"] },
  ],
  music: [
    {
      // First one will always be played as default (name can be changed)
      category: "all",
      path: "/home/user/music",
    },
    {
      // You can also add more specific categories if you want to play a portion/folder instead of all
      category: "chill",
      path: "/home/user/music/chill",
    },
  ],
  // You can change the name of a command and the description that will appear under the help panel.
  actionCommands: {
    joinChannel: {
      command: "join",
      description: "Bot will join your current voice channel.",
    },
    leaveChannel: {
      command: "leave",
      description: "Bot will leave the current voice channel.",
    },
    audioStart: {
      command: "play",
      description: "Bot will play a random song from specified library.",
    },
    audioSkip: {
      command: "skip",
      description: "Bot will skip the current song.",
    },
    audioName: {
      command: "song-name",
      description: "Get current song name",
    },
    helpPanel: { command: "help", description: "Display the help page." },
    stats: { command: "stats", description: "Display bot statistics" },
    termOfService: {
      command: "tos",
      description: "Shows the term of service.",
    },
    donateLink: { command: "donate", description: "Allows for link donation." },
    refreshFileCache: {
      command: "refresh-cache",
      description: "Check for new image/music",
    },
  },
  commandOptions: {
    cacheWaitTime: 1800, // In seconds
  },
  // You can alter messages (<name> will be replaced with dynamic values)
  templateMessages: {
    imageInvalidParam: "You have inputted an invalid parameter",
    imageSendSource: "Source: <file>",
    imageSendFail: "I was unable to find an image of the requested type.",
    imageSendWait: "You have to wait <time>",
    songInvalidParam: "You have inputted an invalid parameter.",
    songNotPlaying: "There is no song playing. Play music using <command>",
    currentSongPlaying: "The current song is <song>",
    cacheRefreshFail:
      "Cache can't be refreshed yet. Wait <time> or contact an admin.",
    cacheRefreshSuccess: "Cache was refreshed. (<change> files)",
    donateLinkSuccess: "Link submitted. Thank you.",
    donateLinkFail: "Please specify a link/data.",
  },
  helpWindow: {
    color: "#0099ff",
    title: "Command Index",
    description: "You are able to use any of these commands, have fun!",
    imageCommandTitle: "Image commands",
    imageCommandSyntax: "**<command>** - <description>",
    musicCommandTitle: "Music commands",
    musicCommandSyntax: "**<command>** - <description>",
    generalCommandTitle: "Info commands",
    generalCommandSyntax: "**<command>** - <description>",
    footer: "TIP: I also answer commands in direct messages!",
  },
};
