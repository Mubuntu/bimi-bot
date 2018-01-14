var async = require('asyncawait/async');
var await = require('asyncawait/await');
const Discord = module.require('discord.js');

module.exports.run = async((bot, message, args) => {
    let embed = new Discord.RichEmbed()
        .setAuthor(message.author.username)
        .setDescription("dit is de gebruiker zijn info!")
        .setColor('#FF69B4')
        .addField("Full Username", `${message.author.username} ${message.author.discriminator}`)
        .addField("ID", `${message.author.id}`)
        .addField("Created At", `${message.author.createdAt}`)
        .addField("Last Message", `${message.author.lastMessage}`);

    message.channel.send({
        embed: embed
    });
});

module.exports.help = {
    name: "userinfo"
};