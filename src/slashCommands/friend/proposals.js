const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("proposals")
    .setDescription("✨ Mira las propuestas de amistad"),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const userId = interaction.user.id;

    // Encontrar las solicitudes de amistad recibidas
    const userProfile = await prisma.userProfile.findUnique({
      where: { userId: userId },
      include: { receivedRequests: true, sentRequests: true },
    });

    const statusRequests = {
      Pending: "Pendiente",
      Accepted: "Aceptada",
      Declined: "Rechazada",
    };

    const proposals = userProfile.receivedRequests
      .map(
        (request) =>
          `\`\`\`yml\nDe: ${request.senderId}, Estado: ${
            statusRequests[request.status]
          }\`\`\``
      )
      .join("");
    const enviadas = userProfile.sentRequests
      .map(
        (sendRequest) =>
          `\`\`\`yml\nEstado: ${statusRequests[sendRequest.status]}, Para: ${
            sendRequest.receiverId
          }\`\`\``
      )
      .join("");

    interaction.reply({
      content: `${emj.check} **Solicitudes recibidas:**\n${
        proposals || "* No tienes solicitudes de amistad pendientes."
      }\n${emj.neutral} **Solicitudes enviadas:**\n${
        enviadas || "* No has enviado solicitudes de amistad."
      }`,
      ephemeral: true,
    });
  },
};
