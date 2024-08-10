const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("decline")
    .setDescription("✨ Rechazar una solicitud de amistad")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario al que rechazaras la solicitud")
        .setRequired(true)
    ),
  cooldown: 5,
  owner: false,
  memberPermissions: [],
  botPermissions: [],
  async execute(interaction, client) {
    const { user, guild, options } = interaction;
    const sUser = options.getUser("usuario");
    if (sUser.bot) {
      return interaction.reply({
        content: `${emj.deny} El usuario no puede ser un bot`,
        ephemeral: true,
      });
    }

    if (sUser.id === user.id) {
      return interaction.reply({
        content: `${emj.deny} No puedes hacer esto contigo mismo.`,
        ephemeral: true,
      });
    }

    // Verificar si el perfil del usuario está registrado en la DB
    const userData = await prisma.userProfile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!userData) {
      return interaction.reply({
        content: `No tienes un perfil registrado.`,
        ephemeral: true,
      });
    }

    // Verificar si el usuario tiene un solicitud de amistad pendiente (Solo el usuario que recibió la solicitud puede rechazarla)
    const existingRequest = await prisma.friendRequest.findFirst({
      where: {
        senderId: sUser.id,
        receiverId: user.id,
        status: "Pending",
      },
    });

    if (!existingRequest) {
      console.log(`No hay datos: ${existingRequest}`);
      return interaction.reply({
        content: `${emj.deny} No tienes una solicitud de amistad pendiente de \`${sUser.tag}\``,
        ephemeral: true,
      });
    }
    console.log(`Se encontraron:\n${existingRequest}`);

    try {
      // Rechazar la solicitud pendiente
      await prisma.friendRequest.update({
        where: { id: existingRequest.id },
        data: { status: "Declined" },
      });

      interaction.reply({
        content: `${emj.check} Has rechazado la solicitud de amistad de ${sUser}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: `${emj.deny} Hubo un error al rechazar la solicitud de amistad. Inténtalo de nuevo más tarde.`,
        ephemeral: true,
      });
    }
  },
};
