const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "user",
  description: "Ver la información de un usuario",
  usage: "s!user <user>",
  aliases: [],
  cooldown: 4,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(message, args, client) {
    const userIdOrMention = args[0];
    if (!userIdOrMention)
      return message.reply(
        "Por favor menciona a un usuario o proporciona una ID."
      );

    const userId = userIdOrMention.replace(/[<@!>]/g, "");
    const user = await client.users.fetch(userId).catch(() => null);
    if (!user)
      return message.reply(
        "No se pudo encontrar al usuario con esa ID o mención."
      );

    const member = message.guild.members.cache.get(user.id);

    const roles =
      member.roles.cache
        .filter((role) => role.id !== message.guild.id)
        .map((role) => `<@&${role.id}>`)
        .join(", ") || "None";

    const userInfoEmbed = new EmbedBuilder()
      .setColor(emb.color)
      .setTitle(`Información de ${user.tag}`)
      .setThumbnail(user.displayAvatarURL())
      .addFields([
        { name: "ID", value: user.id, inline: true },
        { name: "Tag", value: user.tag, inline: true },
        { name: "Nickname", value: member.nickname || "N/A", inline: true },
        {
          name: "Joined Discord",
          value: user.createdAt.toDateString(),
          inline: true,
        },
        {
          name: "Joined Server",
          value: member.joinedAt.toDateString(),
          inline: true,
        },
        { name: "Roles", value: roles },
      ])
      .setTimestamp()
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });

    message.channel.send({ embeds: [userInfoEmbed] });
  },
};
