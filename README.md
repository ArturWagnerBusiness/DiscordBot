# Discord Bot

##### Bot that gets local images from a system and can post them to text channels.

Before running, you will have to have node 12 or higher installed or discord embeds will not work. <br/>

You can then run `npm install` to download the needed dependencies such as `discord.js`<br/>

To run the script a discord token that should be inserted into a file at the root directory called `token.ts`<br/>

```
export const TOKEN = "<TOKEN>";
```

Paths to images and songs should be changed in the `config.TEMPLATE.ts`. For the config to work you will need to remove the `.TEMPLATE` so that you will have a `config.ts` file.<br/>

After that you can run `tsc -w` to compile the typescript files (You can install typescript globally using `npm install -g typescript`)</br>

##### At the end you can run `npm start` to run the bot.
