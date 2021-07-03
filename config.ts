// Wait time in minutes
export const admins = ["193313733471240192"];
// Path to image folder
let rootPath = "/home/artur/GoogleDrive/DriveSyncFiles/Images";
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

/*
    End of Config
*/

import fs from "fs";

function constructPath(name: string) {
  return `${rootPath}/${name}/`;
}
const memeFolders = memeFoldersRaw.map((folder) => constructPath(folder));
const animeFolders = animeFoldersRaw.map((folder) => constructPath(folder));
const lewdFolders = lewdFolderRaw.map((folder) => constructPath(folder));
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
