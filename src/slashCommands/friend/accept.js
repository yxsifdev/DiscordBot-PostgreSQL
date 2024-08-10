const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const { SlashCommandBuilder } = require("discord.js");
const emj = require("../../botconfig/emojis.json");
const emb = require("../../botconfig/embed.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("accept")
    .setDescription("✨ Aceptar una solicitud de amistad")
    .addUserOption((option) =>
      option
        .setName("usuario")
        .setDescription("Usuario al que aceptarás la solicitud")
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

    // Verificar si el usuario tiene un solicitud de amistad pendiente (Solo el usuario que recibió la solicitud puede aceptar)
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
      // Aceptar la solicitud pendiente
      await prisma.friendRequest.update({
        where: { id: existingRequest.id },
        data: { status: "Accepted" },
      });

      // Incrementar el contador de amigos para ambos usuarios
      await prisma.userProfile.update({
        where: {
          userId: user.id,
        },
        data: { friends: { increment: 1 } },
      });

      await prisma.userProfile.update({
        where: {
          userId: sUser.id,
        },
        data: { friends: { increment: 1 } },
      });

      interaction.reply({
        content: `✨ Ahora ${sUser} y tu son amigos.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: `${emj.deny} Hubo un error al aceptar la solicitud de amistad. Inténtalo de nuevo más tarde.`,
        ephemeral: true,
      });
    }
  },
};
