import { admins } from "./config";
var waitingAuthors: {
  [key: string]: {
    [key: string]: number;
  };
} = {};

export function randomFile(
  array: string[],
  type: "png" | "gif" | "mp4" | "all"
) {
  if (type === "all") return array[Math.floor(Math.random() * array.length)];

  var checkExtension = ["/"];
  switch (type) {
    case "png":
      checkExtension = ["png", "jpg", "jpeg"];
      break;
    case "gif":
      checkExtension = ["gif"];
      break;
    case "mp4":
      checkExtension = ["mov", "mp4", "avi"];
      break;
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
export function checkUser(
  authorId: string,
  expectedWait: number,
  waitEvent: string
) {
  if (admins.includes(authorId)) {
    return true;
  }
  if (waitingAuthors[authorId] === undefined) {
    waitingAuthors[authorId] = {
      [waitEvent]: Date.now() + expectedWait * 60000,
    };

    return true;
  } else if (waitingAuthors[authorId][waitEvent] > Date.now()) {
    return false;
  } else {
    waitingAuthors[authorId][waitEvent] = Date.now() + expectedWait * 60000;
    return true;
  }
}
export function getWaitTime(authorId: string, waitEvent: string) {
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
