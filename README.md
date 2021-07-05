# Discord Image Bot

##### Bot that gets local images from a system and can post them to text channels.

You can run `npm install` to install the needed dependencies such as `discord.js`<br/>

To run the script a discord token needs to be inserted for the bot. This can be done in a file in the root called `token.js`<br/>

```
module.exports = "<TOKEN>";
```

Paths to images and songs should be changed in the `config.ts`<br/>

After that you can run `tsc -w` to compile the typescript files (You can install typescript globally using `npm install -g typescript`) and then run `npm start` to initiate the bot.
