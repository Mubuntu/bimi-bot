const botSettings = require("./auth.json"); //file on fs
const Discord = require("discord.js"); //package
var async = require('async');
// create client
const bot = new Discord.Client({
    disableEveryone: true
});

bot.on("ready", async () => {
    console.log(`bot is ready ${bot.user.username}`);

    try {
        let link = await bot.generateInvite(["ADMINISTRATOR"]);
        console.log(link);
    } catch (e) {
        console.log(e.stack);
    }
});

bot.login(botSettings.token);