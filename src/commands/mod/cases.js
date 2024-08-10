const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");
const { pagination } = require("../../functions/pagination"); // Ajusta la ruta si es necesario

module.exports = {
  name: "cases",
  description: "Muestra las últimas 20 sanciones realizadas",
  usage: "s!cases",
  aliases: [],
  cooldown: 4,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(message, args, client) {
    const guild = await prisma.guild.findUnique({
      where: { guildId: message.guild.id },
      select: { id: true },
    });

    if (!guild)
      return message.reply("No se pudo encontrar el ID del servidor.");

    const warnings = await prisma.warning.findMany({
      where: { guildId: guild.id },
      orderBy: { date: "desc" },
      take: 20, // Cambia el número si quieres más casos en total
    });

    if (warnings.length === 0) {
      return message.reply("No hay casos de moderación en este servidor.");
    }

    // Crear páginas de embeds
    const pages = [];
    let pageContent = "";
    const casesPerPage = 5;

    for (let i = 0; i < warnings.length; i++) {
      if (i % casesPerPage === 0 && i !== 0) {
        pages.push(
          new EmbedBuilder()
            .setColor(emb.color)
            .setTitle("Últimos Casos de Moderación")
            .setTimestamp()
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(pageContent)
        );
        pageContent = "";
      }

      const warning = warnings[i];
      const mod = await client.users
        .fetch(warning.moderatorId)
        .catch(() => null);

      const caseDate = `<t:${Math.floor(warning.date.getTime() / 1000)}:R>`; // Convertir a timestamp en segundos

      pageContent +=
        `**Caso #${warning.case} - ${mod ? mod.tag : "Desconocido"}**\n` +
        `**Acción**: ${warning.action}\n` +
        `**Razón**: ${warning.reason}\n` +
        `**Fecha**: ${caseDate}\n\n`;

      if (i === warnings.length - 1) {
        pages.push(
          new EmbedBuilder()
            .setColor(emb.color)
            .setTitle("Últimos Casos de Moderación")
            .setTimestamp()
            .setFooter({
              text: client.user.tag,
              iconURL: client.user.displayAvatarURL(),
            })
            .setDescription(pageContent)
        );
      }
    }

    // Usar la función de paginación
    await pagination(message, pages, { time: 60000 });
  },
};
