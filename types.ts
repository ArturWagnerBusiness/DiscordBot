import { VoiceConnection } from "discord.js";

export namespace Bot {
  export interface Filter {
    name: string;
    extensions: string[];
  }
  export interface Image {
    command: string;
    description: string;
    path: string;
    waitTime: number;
    spoiler?: boolean;
    directMessage?: boolean;
    cleanupMessage?: boolean;
  }
  export interface Music {
    category: string;
    path: string;
  }
  export interface Command {
    command: string;
    description: string;
  }
  export interface Config {
    admins: string[];
    commandSuffix: string;
    images: Image[];
    imageFilters?: Filter[];
    music: Music[];
    actionCommands: {
      joinChannel: Command;
      leaveChannel: Command;
      audioStart: Command;
      audioSkip: Command;
      audioName: Command;
      helpPanel: Command;
      stats: Command;
      termOfService: Command;
      donateLink: Command;
      refreshFileCache: Command;
    };
    templateMessages: {
      imageInvalidParam: string;
      imageSendSource: string;
      imageSendFail: string;
      imageSendWait: string;
      songInvalidParam: string;
      songNotPlaying: string;
      currentSongPlaying: string;
      cacheRefreshSuccess: string;
      cacheRefreshFail: string;
      donateLinkSuccess: string;
      donateLinkFail: string;
    };
    commandOptions: {
      cacheWaitTime: number;
    };
    helpWindow: {
      color: string;
      title: string;
      description: string;
      imageCommandTitle: string;
      imageCommandSyntax: string;
      musicCommandTitle: string;
      musicCommandSyntax: string;
      generalCommandTitle: string;
      generalCommandSyntax: string;
      footer: string;
    };
  }
  export interface Channel {
    channel: VoiceConnection;
    song: string;
    library: string[];
    rootPath: string;
  }
  export interface Cache {
    images: { [command: string]: string[] };
    music: { [category: string]: string[] };
    audioChannels: {
      [channel: string]: Channel | undefined;
    };
    startUpTime: number;
    lastCacheRefresh: number;
  }
}
