const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { EmbedBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  name: "case",
  description: "Mostrar información de un caso específico",
  usage: "s!case <caseNumber>",
  aliases: ["c"],
  cooldown: 4,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(message, args, client) {
    const caseNumber = parseInt(args[0], 10);
    if (isNaN(caseNumber))
      return message.reply("Por favor proporciona un número de caso válido.");

    const guildId = await prisma.guild.findUnique({
      where: { guildId: message.guild.id },
      select: { id: true },
    });

    if (!guildId)
      return message.reply("No se pudo encontrar el ID del servidor.");

    const warning = await prisma.warning.findFirst({
      where: {
        case: caseNumber,
        guildId: guildId.id,
      },
    });

    if (!warning) {
      return message.reply(
        `No se encontró un caso con el número ${caseNumber}.`
      );
    }

    const user = await client.users.fetch(warning.userId).catch(() => null);
    const mod = await client.users.fetch(warning.moderatorId).catch(() => null);

    const caseEmbed = new EmbedBuilder()
      .setColor(emb.color)
      .setAuthor({
        name: `${mod.tag} #${caseNumber}`,
        iconURL: mod.displayAvatarURL(),
      })
      .setDescription(
        `**Miembro:** ${user.tag} (${user.id})\n**Acción:** ${warning.action}\n**Razón:**\n${warning.reason}`
      )
      // .addFields([
      //   {
      //     name: "Usuario",
      //     value: user ? `${user.tag}` : "Desconocido",
      //     inline: true,
      //   },
      //   { name: "Acción", value: warning.action, inline: true },
      //   { name: "Razón", value: warning.reason || "N/A" },
      //   { name: "Moderador", value: `<@${warning.moderatorId}>` },
      //   { name: "Fecha", value: warning.date.toDateString() },
      //   {
      //     name: "Fin del Mute",
      //     value: warning.muteEnd ? warning.muteEnd.toDateString() : "N/A",
      //   },
      // ])
      .setTimestamp(warning.date)
      .setFooter({
        text: `Caso #${caseNumber}`,
      });

    message.channel.send({ embeds: [caseEmbed] });
  },
};
