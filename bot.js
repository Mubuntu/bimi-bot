const botSettings = require("./auth.json"); //file on fs
const Discord = require("discord.js"); //package
var async = require('asyncawait/async');
var await = require('asyncawait/await');
// read directory 
const fs = require('fs');

const prefix = botSettings.prefix;
// create client
const bot = new Discord.Client({
    disableEveryone: true
});

// collection that holds up all the commands that will be picked up out of the files
bot.commands = new Discord.Collection();
bot.mutes = require('./mutes.json');

fs.readdir('./cmds', (err, files) => {
    if (err) console.log(err);
    // verwijder .js extension van elk bestand
    let jsfiles = files.filter(f => f.split('.').pop() === 'js');
    if (jsfiles.length <= 0) {
        console.log('No commands to load!');
        return;
    }
    console.log(`loading ${jsfiles.length} commands!`);
    jsfiles.forEach((f, i) => {
        console.log(`${i+1}: ${f} loaded!`);
        let props = require(`./cmds/${f}`);
        bot.commands.set(props.help.name, props);
    });

});


bot.on("ready", async(() => {
    console.log(`bot is ready ${bot.user.username}`);
    try {
        let link = await (bot.generateInvite(["ADMINISTRATOR"]));
        console.log(link);
        // console.log(prefix);
        console.log(bot.commands);

    } catch (e) {
        console.log(e.stack);
    }

    // controleer elke x aantal seconden of de mutee zijn expiration date al gepasseerd is
    bot.setInterval(() => {
        for (let i in bot.mutes) {
            let time = bot.mutes[i].time;
            let guildId = bot.mutes[i].guild;
            let guild = bot.guilds.get(guildId);
            let member = guild.members.get(i);

            let mutedRole = guild.roles.find(r => r.name === 'Bimi Bot muted');
            if (!mutedRole) continue;

            if (Date.now() > time) {
                console.log(`${i} kan nu uit zijn hoek worden gehaald!`);
                member.removeRole(mutedRole);
                delete bot.mutes[i];
                fs.writeFile('./mutes.json', JSON.stringify(bot.mutes), (err) => {
                    if(err) throw err;
                    console.log(`I have umuted ${member.user.tag}`);
                });
            }
        }

    }, 5000);
}));

bot.on("message", async(message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let messageArray = message.content.split(' ');
    let command = messageArray[0];
    let args = messageArray.slice(1);
    console.log(messageArray);


    if (!command.startsWith(botSettings.prefix)) {
        return;
    }

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);

}));

bot.login(botSettings.token);