const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "warn",
  description: "Sancionar a un usuario",
  usage: "s!warn <user> <reason>",
  aliases: ["w"],
  cooldown: 4,
  owner: false,
  memberPermissions: ["KickMembers"],
  botPermissions: [],
  async execute(message, args, client) {
    if (!args[0])
      return message.reply({
        content: `${emj.deny} **Ingrese los valores correctamente:** \`${this.usage}\``,
      });

    const userId = args[0];
    if (!userId)
      return message.reply("Por favor proporciona una ID de usuario.");

    const user = await client.users.fetch(userId).catch(() => null);
    if (!user) {
      return message.reply("No se pudo encontrar al usuario con esa ID.");
    } else if (userId === message.author.id) {
      return message.reply("No puedes sancionarte a tu mismo.");
    } else if (user.bot) {
      return message.reply({ content: `El usuario no puede ser un bot.` });
    }

    const reason = args.slice(1).join(" ") || "No proporcionada";
    const guildId = message.guild.id;
    const moderatorId = message.author.id;

    const guild = await prisma.guild.upsert({
      where: { guildId },
      update: {},
      create: { guildId },
    });

    const caseNumber = guild.caseCounter + 1;

    await prisma.warning.create({
      data: {
        userId,
        moderatorId,
        action: "Warn",
        reason,
        case: caseNumber,
        date: new Date(),
        guildId: guild.id,
      },
    });

    await prisma.guild.update({
      where: { id: guild.id },
      data: { caseCounter: caseNumber },
    });

    const warnEmbed = new EmbedBuilder()
      .setColor(emb.color)
      .setTitle("Usuario Advertido")
      .setDescription(`Usuario ${user.tag} ha sido advertido por: ${reason}`)
      .setTimestamp()
      .setFooter({
        text: client.user.tag,
        iconURL: client.user.displayAvatarURL(),
      });

    message.reply({ embeds: [warnEmbed] });
  },
};
