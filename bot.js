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
        bot.commands.set(props.help.name,props);
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
    if(cmd) cmd.run(bot,message, args);

   
    if (command === `${prefix}mute`) {
        /** 
         * get the mentioned user, return if true
         * check if the command executor  has the right permission to do this command. 
         * if the mutee has the same or higher role than the muter return. 
         */
        // get the mentioned user, return if there is none. !mute 023042094939402 
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('U hebt niet de juiste rol voor deze actie.');
        // andere optie: if(message.channel.permissionsFor(message.member).hasPermission('MANAGE_MESSAGES'))

        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);

        if (toMute != undefined && toMute.id === message.author.id) return message.channel.send('ge kunt uzelf niet muten foemp!');

        if (toMute.highestRole.position >= message.member.highestRole.postion) return message.channel.send(`${message.author.username} heeft een hogere rol dan gij, you have no power here!`);

        if (!toMute) return message.channel.send('specifieer een user om te muten of ID!');
        let role = message.guild.roles.find(r => r.name === "Bimi Bot muted");
        if (!role) {
            try {
                role = await (message.guild.createRole({
                    name: "Bimi Bot muted",
                    color: "#03249",
                    permissions: []
                }));
                message.guild.channels.forEach(async((channel, id) => {
                    await (channel.overwritePermissions(role, {
                        SEND_MESSAGES: false,
                        ADD_REACTIONS: false,
                        SPEAK: false
                    }));
                }));
            } catch (e) {
                console.log(e.stack);
            }
        }

        if (toMute.roles.has(role.id)) return message.channel.send(`${toMute} is al gemuted!`);
        // return message.reply(toMute.username || toMute.user.username);

        await (toMute.addRole(role));
        message.channel.send(`${toMute} is momenteel gemuted!`);
        return;
    }
    if (command === `${prefix}unmute`) {
        /** 
         * get the mentioned user, return if true
         * check if the command executor  has the right permission to do this command. 
         * if the mutee has the same or higher role than the muter return. 
         */
        // get the mentioned user, return if there is none. !mute 023042094939402 
        if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('U hebt niet de juiste rol voor deze actie.');
        // andere optie: if(message.channel.permissionsFor(message.member).hasPermission('MANAGE_MESSAGES'))
        let toMute = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!toMute) return message.channel.send('specifieer een user om te muten of ID!');
        let role = message.guild.roles.find(r => r.name === "Bimi Bot muted");


        if (!role || !toMute.roles.has(role.id)) return message.channel.send(`${toMute} is niet gemuted!`);
        // return message.reply(toMute.username || toMute.user.username);

        await (toMute.removeRole(role));
        message.channel.send(`${toMute} is momenteel ungemuted!`);
        return;
    }
}));

bot.login(botSettings.token);