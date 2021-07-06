/*
    !Start of Config
*/
// Wait time in minutes
export const admins = ["193313733471240192", "393715579879686147"];
// Folders for anime
let animeFoldersRaw = "/home/artur/GoogleDrive/Images/Anime";
// Folders for memes
let memeFoldersRaw = "/home/artur/GoogleDrive/Images/Memes";
// Folders for lewds
let lewdFolderRaw = "/home/artur/GoogleDrive/Images/Lewd";
// Folders for songs
let songFoldersRaw = "/home/artur/GoogleDrive/DriveSyncFiles/Music";
/*
    !End of Config
*/
import fs from "fs";
function traverseFolders(path: string, extension = "") {
  let files: string[] = [];
  fs.readdirSync(path).forEach((entity) => {
    let entityStats = fs.lstatSync(`${path}/${entity}`);
    if (entityStats.isFile() && entity.endsWith(extension)) {
      files.push(`${path}/${entity}`);
    } else if (entityStats.isDirectory()) {
      files.push(...traverseFolders(`${path}/${entity}`));
    }
  });
  return files;
}
export const memeImageRootFolder = <string>memeFoldersRaw.split("/").pop();
export const animeImageRootFolder = <string>animeFoldersRaw.split("/").pop();
export const lewdImageRootFolder = <string>lewdFolderRaw.split("/").pop();
export const songsRootFolder = <string>songFoldersRaw.split("/").pop();
export const memeImagePaths = traverseFolders(memeFoldersRaw);
export const animeImagePaths = traverseFolders(animeFoldersRaw);
export const lewdImagePaths = traverseFolders(lewdFolderRaw);
export const songsPaths = traverseFolders(songFoldersRaw, ".mp3");
