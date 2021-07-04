# Discord Image Bot

##### Bot that gets local images from a system and can post them to text channels.

You can run `npm install` to install the needed dependencies.<br/>

To run the script a discord token needs to be inserted for the bot. This can be done in a file in the root called `token.js`<br/>

```
module.exports = "<TOKEN>";
```

Empty files need to be made, you can do

```
touch log.txt && touch donate.txt
```

Paths and folders can be changed in the `config.ts`<br/>

After that you should be able to run `tsc -w` to compile the typescript files and then run `npm start` to initiate the bot.
