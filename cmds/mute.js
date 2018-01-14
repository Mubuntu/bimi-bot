var async = require('asyncawait/async');
var await = require('asyncawait/await');
const fs = require('fs');

module.exports.run = async((bot, message, args) => {
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
                color: "#03212",
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

    console.log(` uitput: ${args[2]}   andere ` + args[1]);
    bot.mutes[toMute.id] = {
        guild: message.guild.id,
        time: Date.now() + parseInt(args[1]) * 60 * 1000 // mute for ten seconds
    };
    //schrijf de mutee naar de lijst
    fs.writeFile('./mutes.json', JSON.stringify(bot.mutes, null, 4), err => {
        if (err) throw err;
        if (parseInt(args[1]))
            message.channel.send(`${toMute } is nu muted tot ${new Date(bot.mutes[toMute.id].time).toLocaleString()}`);
    });
    await (toMute.addRole(role));
    message.channel.send(`${toMute} is momenteel gemuted!`);
});

module.exports.help = {
    name: "mute"
};