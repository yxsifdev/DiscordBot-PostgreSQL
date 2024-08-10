const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "reason",
  description: "Modifica la razón de un caso específico",
  usage: "s!reason <caseNumber> <newReason>",
  aliases: [],
  cooldown: 4,
  owner: false,
  memberPermissions: ["KickMembers"],
  botPermissions: [],
  async execute(message, args, client) {
    const caseNumber = parseInt(args[0], 10); // Número del caso
    const newReason = args.slice(1).join(" "); // Nueva razón

    if (!caseNumber || isNaN(caseNumber))
      return message.reply({
        content: `${emj.deny} Por favor proporciona un número de caso válido.`,
      });

    if (!newReason)
      return message.reply({
        content: `${emj.deny} Por favor proporciona una nueva razón.`,
      });

    const guildId = message.guild.id;

    // Obtén el ID del guild desde el modelo Guild
    const guild = await prisma.guild.findUnique({
      where: {
        guildId, // Utiliza guildId aquí
      },
    });

    if (!guild)
      return message.reply({
        content: `${emj.deny} Ha ocurrido un error, inténtalo más tarde.`,
      });

    const updatedWarning = await prisma.warning.updateMany({
      where: {
        case: caseNumber,
        guildId: guild.id, // Usa el ID del guild para la consulta
      },
      data: {
        reason: newReason,
      },
    });

    if (updatedWarning.count === 0)
      return message.reply({
        content: `${emj.deny} No se encontró el caso o no se pudo actualizar.`,
      });

    message.reply({ content: `${emj.check} Razón actualizada correctamente.` });
  },
};
