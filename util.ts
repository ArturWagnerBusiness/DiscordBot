import fs from "fs";
import { CONFIG } from "./config";
var waitingAuthors: {
  [key: string]: {
    [key: string]: number;
  };
} = {};
export function traverseFolders(path: string, extension = "") {
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
export function randomFile(array: string[], checkExtension: string[]) {
  if (checkExtension.length === 0) {
    return array[Math.floor(Math.random() * array.length)];
  }
  let newArray = array
    .map((file) => {
      let extension = file.split(".").pop();
      if (!extension) {
        return;
      }
      if (!checkExtension.includes(extension)) {
        return;
      }
      return file;
    })
    .filter(function (item) {
      return typeof item === "string";
    });
  let file = newArray[Math.floor(Math.random() * newArray.length)];
  return file ? file : undefined;
}
export function isUserWait(authorId: string, waitEvent: string) {
  if (CONFIG.admins.includes(authorId)) return false;

  if (
    waitingAuthors[authorId] === undefined ||
    waitingAuthors[authorId][waitEvent] === undefined ||
    waitingAuthors[authorId][waitEvent] <= Date.now()
  ) {
    return false;
  }
  return true;
}
export function setUserWait(
  authorId: string,
  expectedWait: number,
  waitEvent: string
) {
  if (waitingAuthors[authorId] === undefined) {
    waitingAuthors[authorId] = {};
  }
  waitingAuthors[authorId][waitEvent] = Date.now() + expectedWait * 1000;
}
export function getUserWaitText(authorId: string, waitEvent: string) {
  if (!waitingAuthors[authorId] || !waitingAuthors[authorId][waitEvent]) {
    console.log("ERROR: Read wait time for no existing user!");
    return "0s";
  }
  let wait = Math.floor(
    (waitingAuthors[authorId][waitEvent] - Date.now()) / 60000
  );
  if (wait > 59) {
    return `${Math.floor(wait / 60)}h ${(wait % 60) + 1}min`;
  } else if (wait > 0) {
    return `${wait + 1}m`;
  } else {
    return `${Math.floor(
      (waitingAuthors[authorId][waitEvent] - Date.now()) / 1000
    )}s`;
  }
}
export function saveData(filename: string, data: string) {
  fs.appendFile(filename, data + "\n", function (err) {
    if (err) {
      console.log(`Error happened in "${filename}" with data "${data}"`);
    }
  });
}
