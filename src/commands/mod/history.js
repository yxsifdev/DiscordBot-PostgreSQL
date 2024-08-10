const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");
const { EmbedBuilder } = require("discord.js");
const { pagination } = require("../../functions/pagination"); // Ajusta la ruta si es necesario

module.exports = {
  name: "history",
  description: "Ver el historial de sanciones de un usuario",
  usage: "s!history <user>",
  aliases: [],
  cooldown: 4,
  owner: false,
  memberPermissions: ["KickMembers"],
  botPermissions: [],
  async execute(message, args, client) {
    const userId = args[0];
    if (!userId)
      return message.reply("Por favor proporciona una ID de usuario.");

    const user = await client.users.fetch(userId).catch(() => null);
    if (!user)
      return message.reply("No se pudo encontrar al usuario con esa ID.");
    if (user.bot)
      return message.reply({ content: `El usuario no puede ser un bot.` });

    const guildId = message.guild.id;

    const warnings = await prisma.warning.findMany({
      where: {
        userId,
        guild: {
          guildId,
        },
      },
    });

    if (warnings.length === 0) {
      return message.reply(`El usuario ${user.tag} no tiene sanciones.`);
    }

    // Contar las sanciones por tipo
    const sanctionCounts = {
      Warn: 0,
      Mute: 0,
      Kick: 0,
      Ban: 0,
    };

    warnings.forEach((warn) => {
      sanctionCounts[warn.action]++;
    });

    // Crear páginas de embeds
    const pages = [];
    let pageContent = "";

    warnings.forEach((warn, index) => {
      if (index % 10 === 0 && index !== 0) {
        pages.push(
          new EmbedBuilder()
            .setColor(emb.color)
            .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
            .setFooter({
              text: `Warned: ${sanctionCounts.Warn} | Muted: ${sanctionCounts.Mute} | Kicked: ${sanctionCounts.Kick} | Banned: ${sanctionCounts.Ban}`,
            })
            .setDescription(pageContent)
        );
        pageContent = "";
      }
      pageContent += `**Caso #${warn.case} - ${warn.action}**\n${warn.reason}\n\n`;
    });

    if (pageContent) {
      pages.push(
        new EmbedBuilder()
          .setColor(emb.color)
          .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
          .setFooter({
            text: `Warned: ${sanctionCounts.Warn} | Muted: ${sanctionCounts.Mute} | Kicked: ${sanctionCounts.Kick} | Banned: ${sanctionCounts.Ban}`,
          })
          .setDescription(pageContent)
      );
    }

    // Usar la función de paginación
    await pagination(message, pages, { time: 60000 });
  },
};
