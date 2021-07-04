// Wait time in minutes
export const admins = ["193313733471240192"];
// Path to image folder
let rootPath = "/home/artur/GoogleDrive";
// Folders for anime
let animeFoldersRaw = [
  "Akashic Records",
  "Angels of Death",
  "Arknights",
  "Azur Lane",
  "Clock Work Planet",
  "Date a Live",
  "Fate",
  "Genshin Impact",
  "Girls Frontline",
  "Hololive",
  "Inuyama Tamaki",
  "Is the Order a Rabbit",
  "Kagura nana",
  "Kancolle",
  "League of Legends",
  "Majo no tabitabi",
  "Mushoku Tensei",
  "Nekopara",
  "No Game No Life",
  "Owari no Seraph",
  "Punishing Gray Raven",
  "Re Zero",
  "The Ryuo's Work",
  "Touhou",
  "UNDEFINED",
  "Vocaloid",
];
// Folders for memes
let memeFoldersRaw = ["_Meme"];
// Folders for lewds
let lewdFolderRaw = ["Ecchi", "Ecchi Real"];
// Folders for songs
let songFoldersRaw = [
  "Music",
  "Music/FFF",
  "Music/old",
  "Music/old 2",
  "Music/old 3",
  "Music/old 4",
  "Music/Kairiki Bear Encore Album Venomer",
  "Music/Takamachi Walk - Permanence",
  "Music/Yunosuke",
  "Music/かいりきベア",
];
/*
!    End of Config
*/

import fs from "fs";

const memeFolders = memeFoldersRaw.map(
  (folder) => `${rootPath}/Images/${folder}/`
);
const animeFolders = animeFoldersRaw.map(
  (folder) => `${rootPath}/Images/${folder}/`
);
const lewdFolders = lewdFolderRaw.map(
  (folder) => `${rootPath}/Images/${folder}/`
);
const songFolders = songFoldersRaw.map(
  (folder) => `${rootPath}/DriveSyncFiles/${folder}/`
);

export const memeImagePaths = (() => {
  let files: string[] = [];
  memeFolders.forEach((folder) => {
    fs.readdirSync(folder).forEach((file) => {
      files.push(folder + file);
    });
  });
  return files;
})();
export const animeImagePaths = (() => {
  let files: string[] = [];
  animeFolders.forEach((folder) => {
    fs.readdirSync(folder).forEach((file) => {
      files.push(folder + file);
    });
  });
  return files;
})();

export const lewdImagePaths = (() => {
  let files: string[] = [];
  lewdFolders.forEach((folder) => {
    fs.readdirSync(folder).forEach((file) => {
      files.push(folder + file);
    });
  });
  return files;
})();

export const songsPaths = (() => {
  let files: string[] = [];
  songFolders.forEach((folder) => {
    fs.readdirSync(folder).forEach((file) => {
      if (file.includes(".mp3")) {
        files.push(folder + file);
      }
    });
  });
  return files;
})();
