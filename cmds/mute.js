var async = require('asyncawait/async');
var await = require('asyncawait/await');

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
});

module.exports.help = {
    name: "mute"
};